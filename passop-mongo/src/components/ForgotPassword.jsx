import React, { useRef, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ForgotPassword({ onSwitchToLogin }) {
    const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const passwordRef = useRef(null)
    const confirmPasswordRef = useRef(null)
    const eyeImgRef = useRef(null)
    const confirmEyeImgRef = useRef(null)

    const togglePasswordVisibility = (field) => {
        let input, img
        if (field === 'password') {
            input = passwordRef.current
            img = eyeImgRef.current
        } else {
            input = confirmPasswordRef.current
            img = confirmEyeImgRef.current
        }
        if (!input || !img) return
        if (img.src.includes('icons/eye.png')) {
            img.src = 'icons/eyecross.png'
            input.type = 'password'
        } else {
            img.src = 'icons/eye.png'
            input.type = 'text'
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        if (!form.email || !form.password || !form.confirmPassword) {
            toast.error('Please fill in all fields', { autoClose: 2000 })
            return false
        }
        const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email)
        if (!emailOk) {
            toast.error('Please enter a valid email', { autoClose: 2000 })
            return false
        }
        if (form.password.length < 4) {
            toast.error('Password must be at least 4 characters', { autoClose: 2000 })
            return false
        }
        if (form.password !== form.confirmPassword) {
            toast.error('Passwords do not match', { autoClose: 2000 })
            return false
        }
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        try {
            setIsSubmitting(true)
            const response = await fetch('http://localhost:3000/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password })
            })
            const data = await response.json()
            if (data.success) {
                toast.success('Password reset successfully!', { autoClose: 3000 })
                setForm({ email: '', password: '', confirmPassword: '' })
                // Automatically navigate to login page after 2 seconds
                setTimeout(() => {
                    onSwitchToLogin()
                }, 2000)
            } else {
                toast.error(data.message || 'Failed to reset password', { autoClose: 2000 })
            }
        } catch (err) {
            toast.error('Network error. Please try again.', { autoClose: 2000 })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme="dark"
                transition={Bounce}
            />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div>
            </div>

            <div className="p-3 md:mycontainer min-h-[88.2vh] flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-sm md:max-w-md bg-white/90 backdrop-blur rounded-2xl border border-green-300 p-5 md:p-6 shadow">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
                        <span className='text-black'>Lock</span><span className='text-orange-500'>Verse</span>
                    </h1>
                    <p className="text-center text-slate-700 mb-4 md:mb-6">Reset your password</p>
                    <p className="text-center text-slate-600 mb-6 text-sm">Enter your email and new password to reset your account password.</p>

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="mb-4 rounded-full border border-green-500 w-full p-4 py-3 bg-white text-base md:text-lg"
                    />

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">New Password</label>
                    <div className="relative mb-4">
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base md:text-lg"
                        />
                        <span className='absolute right-[4px] top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => togglePasswordVisibility('password')}>
                            <img ref={eyeImgRef} className='p-1' width={26} src="icons/eyecross.png" alt="toggle password visibility" />
                        </span>
                    </div>

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
                    <div className="relative mb-6">
                        <input
                            ref={confirmPasswordRef}
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base md:text-lg"
                        />
                        <span className='absolute right-[4px] top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => togglePasswordVisibility('confirmPassword')}>
                            <img ref={confirmEyeImgRef} className='p-1' width={26} src="icons/eyecross.png" alt="toggle confirm password visibility" />
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-70 rounded-full px-6 md:px-8 py-3 text-white border border-green-900 text-base md:text-lg font-medium"
                    >
                        {isSubmitting ? 'Resetting…' : 'Reset Password'}
                    </button>

                    <div className="text-center mt-4 text-sm text-slate-700">
                        Remember your password?{' '}
                        <button type="button" className="text-fuchsia-700 hover:underline" onClick={onSwitchToLogin}>Back to Login</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default ForgotPassword
