import React, { useRef, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API = import.meta.env.VITE_BACKEND_URL

// ── Shared card shell — defined OUTSIDE ForgotPassword so it never remounts ──
const Background = () => (
    <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
    </div>
)

const StepIndicator = ({ step }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map(n => (
            <React.Fragment key={n}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${step >= n ? 'bg-fuchsia-600 border-fuchsia-600 text-white' : 'bg-white border-slate-300 text-slate-400'}`}>{n}</div>
                {n < 3 && <div className={`flex-1 max-w-[40px] h-0.5 rounded transition-all ${step > n ? 'bg-fuchsia-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
        ))}
    </div>
)

// Step 1 = enter email, Step 2 = enter OTP, Step 3 = enter new password
function ForgotPassword({ onSwitchToLogin }) {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [form, setForm] = useState({ password: '', confirmPassword: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resendCooldown, setResendCooldown] = useState(0)

    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const eyeImgRef = useRef(null)
    const confirmEyeImgRef = useRef(null)
    const otpRefs = useRef([])

    // ── OTP box: auto-advance and backspace handling ──────────────────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return
        const updated = [...otp]
        updated[index] = value.slice(-1)
        setOtp(updated)
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        e.preventDefault()
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (!pasted) return
        const updated = [...otp]
        for (let i = 0; i < 6; i++) updated[i] = pasted[i] || ''
        setOtp(updated)
        otpRefs.current[Math.min(pasted.length, 5)]?.focus()
    }

    const togglePasswordVisibility = (field) => {
        const input = field === 'password' ? passwordRef.current : confirmPasswordRef.current
        const img = field === 'password' ? eyeImgRef.current : confirmEyeImgRef.current
        if (!input || !img) return
        if (img.src.includes('icons/eye.png')) {
            img.src = 'icons/eyecross.png'
            input.type = 'password'
        } else {
            img.src = 'icons/eye.png'
            input.type = 'text'
        }
    }

    // ── Cooldown timer ────────────────────────────────────────────────────────
    const startCooldown = () => {
        setResendCooldown(60)
        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) { clearInterval(interval); return 0 }
                return prev - 1
            })
        }, 1000)
    }

    // ── Step 1: send OTP ──────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault()
        const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email.trim())
        if (!emailOk) { toast.error('Please enter a valid email', { autoClose: 2000 }); return }
        try {
            setIsSubmitting(true)
            const res = await fetch(`${API}/forgot-password/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('OTP sent! Check your email.', { autoClose: 3000 })
                startCooldown()
                setStep(2)
            } else {
                toast.error(data.message || 'Failed to send OTP', { autoClose: 2500 })
            }
        } catch {
            toast.error('Network error. Please try again.', { autoClose: 2000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Step 2: verify OTP ────────────────────────────────────────────────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        const otpValue = otp.join('')
        if (otpValue.length !== 6) { toast.error('Please enter the full 6-digit OTP', { autoClose: 2000 }); return }
        try {
            setIsSubmitting(true)
            const res = await fetch(`${API}/forgot-password/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), otp: otpValue })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('OTP verified!', { autoClose: 1500 })
                setStep(3)
            } else {
                toast.error(data.message || 'Invalid OTP', { autoClose: 2500 })
            }
        } catch {
            toast.error('Network error. Please try again.', { autoClose: 2000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Resend OTP ────────────────────────────────────────────────────────────
    const handleResend = async () => {
        if (resendCooldown > 0) return
        try {
            setIsSubmitting(true)
            const res = await fetch(`${API}/forgot-password/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('New OTP sent!', { autoClose: 2500 })
                setOtp(['', '', '', '', '', ''])
                startCooldown()
                otpRefs.current[0]?.focus()
            } else {
                toast.error(data.message || 'Failed to resend OTP', { autoClose: 2500 })
            }
        } catch {
            toast.error('Network error. Please try again.', { autoClose: 2000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    // ── Step 3: reset password ────────────────────────────────────────────────
    const handleReset = async (e) => {
        e.preventDefault()
        if (!form.password || !form.confirmPassword) {
            toast.error('Please fill in both password fields', { autoClose: 2000 }); return
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters', { autoClose: 3000 }); return
        }
        if (!/[A-Za-z]/.test(form.password)) {
            toast.error('Password must contain at least one letter', { autoClose: 3000 }); return
        }
        if (!/[0-9]/.test(form.password)) {
            toast.error('Password must contain at least one number', { autoClose: 3000 }); return
        }
        if (!/[^A-Za-z0-9]/.test(form.password)) {
            toast.error('Password must contain at least one special character (e.g. @, #, $)', { autoClose: 3000 }); return
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match', { autoClose: 2000 }); return
        }
        try {
            setIsSubmitting(true)
            const res = await fetch(`${API}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password: form.password.trim() })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Password reset successfully!', { autoClose: 3000 })
                setTimeout(() => onSwitchToLogin(), 2000)
            } else {
                toast.error(data.message || 'Failed to reset password', { autoClose: 2500 })
            }
        } catch {
            toast.error('Network error. Please try again.', { autoClose: 2000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="dark" transition={Bounce} />
            <Background />
            <div className="p-3 md:mycontainer min-h-[88.2vh] flex items-center justify-center">
                <div className="w-full max-w-sm md:max-w-md bg-white/90 backdrop-blur rounded-2xl border border-green-300 p-5 md:p-6 shadow">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
                        <span className="text-black">Lock</span><span className="text-orange-500">Verse</span>
                    </h1>
                    <p className="text-center text-slate-700 mb-4 md:mb-6">Reset your password</p>
                    <StepIndicator step={step} />

                    {/* ── Step 1 ── */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            <p className="text-center text-slate-600 mb-5 text-sm">Enter your registered email. We'll send you a 6-digit OTP.</p>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="mb-5 rounded-full border border-green-500 w-full p-4 py-3 bg-white text-base"
                            />
                            <button type="submit" disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-70 rounded-full px-6 py-3 text-white border border-green-900 text-base font-medium">
                                {isSubmitting ? 'Sending…' : 'Send OTP'}
                            </button>
                        </form>
                    )}

                    {/* ── Step 2 ── */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <p className="text-center text-slate-600 mb-1 text-sm">
                                We sent a 6-digit OTP to <span className="font-semibold text-slate-800">{email}</span>
                            </p>
                            <p className="text-center text-slate-500 mb-5 text-xs">Check your inbox (and spam folder).</p>
                            <div className="flex justify-center gap-2 mb-5" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={el => otpRefs.current[i] = el}
                                        type="text" inputMode="numeric" maxLength={1} value={digit}
                                        onChange={e => handleOtpChange(i, e.target.value)}
                                        onKeyDown={e => handleOtpKeyDown(i, e)}
                                        className="w-11 h-12 text-center text-xl font-bold rounded-lg border-2 border-green-400 focus:border-fuchsia-500 focus:outline-none bg-white transition-colors"
                                    />
                                ))}
                            </div>
                            <button type="submit" disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-70 rounded-full px-6 py-3 text-white border border-green-900 text-base font-medium mb-3">
                                {isSubmitting ? 'Verifying…' : 'Verify OTP'}
                            </button>
                            <p className="text-center text-sm text-slate-600">
                                Didn't receive it?{' '}
                                {resendCooldown > 0
                                    ? <span className="text-slate-400">Resend in {resendCooldown}s</span>
                                    : <button type="button" onClick={handleResend} className="text-fuchsia-700 hover:underline">Resend OTP</button>
                                }
                            </p>
                            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 mx-auto mt-3 px-4 py-2 text-sm font-medium text-fuchsia-700 hover:text-fuchsia-500 border border-fuchsia-300 hover:border-fuchsia-500 rounded-full transition-colors">
                                ← Change email
                            </button>
                        </form>
                    )}

                    {/* ── Step 3 ── */}
                    {step === 3 && (
                        <form onSubmit={handleReset}>
                            <p className="text-center text-slate-600 mb-5 text-sm">OTP verified ✅ — now set your new password.</p>
                            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                            <div className="relative mb-4">
                                <input ref={passwordRef} name="password" type="password" value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    placeholder="Enter new password"
                                    className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base"
                                    autoComplete="new-password" autoCorrect="off" autoCapitalize="none" spellCheck="false" />
                                <span className="absolute right-[4px] top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => togglePasswordVisibility('password')}>
                                    <img ref={eyeImgRef} className="p-1" width={26} src="icons/eyecross.png" alt="toggle" />
                                </span>
                            </div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                            <div className="relative mb-6">
                                <input ref={confirmPasswordRef} name="confirmPassword" type="password" value={form.confirmPassword}
                                    onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    placeholder="Confirm new password"
                                    className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base"
                                    autoComplete="new-password" autoCorrect="off" autoCapitalize="none" spellCheck="false" />
                                <span className="absolute right-[4px] top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => togglePasswordVisibility('confirmPassword')}>
                                    <img ref={confirmEyeImgRef} className="p-1" width={26} src="icons/eyecross.png" alt="toggle" />
                                </span>
                            </div>
                            <button type="submit" disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-70 rounded-full px-6 py-3 text-white border border-green-900 text-base font-medium">
                                {isSubmitting ? 'Resetting…' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-4 text-sm text-slate-700">
                        Remember your password?{' '}
                        <button type="button" className="text-fuchsia-700 hover:underline" onClick={onSwitchToLogin}>Back to Login</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword