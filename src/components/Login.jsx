import React, { useRef, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../config'

function Login({ onSuccess, onSwitchToSignup, onSwitchToForgot }) {
    const passwordRef = useRef(null)
    const eyeImgRef = useRef(null)
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [lastBackendMsg, setLastBackendMsg] = useState('')

    const togglePasswordVisibility = () => {
        if (!passwordRef.current || !eyeImgRef.current) return
        const input = passwordRef.current
        const img = eyeImgRef.current
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
        if (!form.name || !form.email || !form.password) {
            toast.error('Please enter username, email and password', { autoClose: 2000 })
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
        return true
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        try {
            setIsSubmitting(true)
            // First try backend authentication
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password
                })
            })
            const data = await response.json()
            console.log('Backend response:', data) // Debug: log the response
            // Save backend message for debugging (visible on the form)
            setLastBackendMsg(data && data.message ? String(data.message) : JSON.stringify(data))
            
            if (data.success && data.user) {
                // Persist current user session locally
                localStorage.setItem('lv_current_user', JSON.stringify(data.user))
                toast.success('Logged in successfully', { autoClose: 800 })
                if (typeof onSuccess === 'function') onSuccess(data.user)
                return
            }

            const message = data.message ? data.message.toLowerCase() : ''
            console.log('Backend error message:', message)

            // First check if it's a "no account found" scenario (ALL THREE WRONG)
            if (message.includes('no account found') || message.includes('not found')) {
                toast.warning('No account found in LockVerse. Create your secure space by signing up now!', { 
                    autoClose: 4000,
                    onClick: onSwitchToSignup
                })
                return
            }

            // Check each field in priority order - but be very strict about what triggers each
            
            // 1. Wrong username - triggered ONLY if message explicitly mentions username
            if (message.includes('username')) {
                toast.error('Enter the correct username', { autoClose: 2000 })
                return
            }

            // 2. Wrong email - triggered ONLY if message explicitly mentions email
            if (message.includes('email')) {
                toast.error('Enter the email address', { autoClose: 2000 })
                return
            }

            // 3. Wrong password - triggered ONLY if message explicitly mentions password
            if (message.includes('password')) {
                toast.error('Enter the correct password', { autoClose: 2000 })
                return
            }

            // 4. Default fallback for any other error (all three wrong, etc.)
            toast.warning('No account found in LockVerse. Create your secure space by signing up now!', { 
                autoClose: 4000,
                onClick: onSwitchToSignup
            })
        } catch (err) {
            console.error('Login error:', err) // Debug: log errors
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
                    <p className="text-center text-slate-700 mb-4 md:mb-6">Login to your account</p>

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Username</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your username"
                        className="mb-4 rounded-full border border-green-500 w-full p-4 py-3 bg-white text-base md:text-lg"
                    />

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

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                    <div className="relative mb-6">
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Your password"
                            className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base md:text-lg"
                        />
                        <span className='absolute right-[4px] top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={togglePasswordVisibility}>
                            <img ref={eyeImgRef} className='p-1' width={26} src="icons/eyecross.png" alt="toggle password visibility" />
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-70 rounded-full px-6 md:px-8 py-3 text-white border border-green-900 text-base md:text-lg font-medium"
                    >
                        {isSubmitting ? 'Signing in…' : 'Sign in'}
                    </button>

                    <div className="text-center mt-4 text-sm text-slate-700">
                        <button type="button" className="text-fuchsia-700 hover:underline mr-2" onClick={onSwitchToForgot}>Forgot Password?</button>
                        <span className="mx-2">|</span>
                        Don't have an account?{' '}
                        <button type="button" className="text-fuchsia-700 hover:underline" onClick={onSwitchToSignup}>Sign up</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login


