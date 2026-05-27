import React, { useRef, useState } from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Signup({ onSuccess, onSwitchToLogin }) {
    const passwordRef = useRef(null)
    const confirmRef = useRef(null)
    const eyePwdRef = useRef(null)
    const eyeCfmRef = useRef(null)
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const toggleVisibility = (inputRef, imgRef) => {
        if (!inputRef.current || !imgRef.current) return
        const input = inputRef.current
        const img = imgRef.current
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
        if (!form.name || !form.email || !form.password || !form.confirm) {
            toast.error('Please fill in all fields', { autoClose: 2000 })
            return false
        }
        const emailOk = /[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email)
        if (!emailOk) {
            toast.error('Please enter a valid email', { autoClose: 2000 })
            return false
        }
        if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters', { autoClose: 2000 })
            return false
        }
        if (form.password !== form.confirm) {
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
            // Persist the new user locally so login can validate
            const raw = localStorage.getItem('lv_users')
            const users = raw ? JSON.parse(raw) : []
            const emailLower = (form.email || '').trim().toLowerCase()
            const exists = users.some((u) => (u.email || '').trim().toLowerCase() === emailLower)
            if (exists) {
                toast.error('An account with this email already exists', { autoClose: 2000 })
                return
            }
            const newUser = { name: form.name, email: emailLower, password: form.password }
            localStorage.setItem('lv_users', JSON.stringify([...users, newUser]))

            // Also store in MongoDB collection 'signup_page_details'
            try {
                const res = await fetch('http://localhost:3000/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                })
                if (!res.ok) {
                    const msg = res.status === 409 ? 'Email already registered (server)' : 'Signup failed (server)'
                    toast.error(msg, { autoClose: 2000 })
                    return
                }
            } catch (_) {
                // If backend is down, keep local success; surface info toast
                toast.info('Saved locally; backend not reachable for signup', { autoClose: 2000 })
            }
            await new Promise((r) => setTimeout(r, 700))
            toast.success('Account created successfully', { autoClose: 900 })
            if (typeof onSuccess === 'function') onSuccess()
        } catch (err) {
            toast.error('Signup failed', { autoClose: 2000 })
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
                    <p className="text-center text-slate-700 mb-4 md:mb-6">Create your account</p>

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
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
                    <div className="relative mb-4">
                        <input
                            ref={passwordRef}
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base md:text-lg"
                        />
                        <span className='absolute right-[4px] top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => toggleVisibility(passwordRef, eyePwdRef)}>
                            <img ref={eyePwdRef} className='p-1' width={26} src="icons/eyecross.png" alt="toggle password visibility" />
                        </span>
                    </div>

                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirm">Confirm Password</label>
                    <div className="relative mb-6">
                        <input
                            ref={confirmRef}
                            id="confirm"
                            name="confirm"
                            type="password"
                            value={form.confirm}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            className="rounded-full border border-green-500 w-full p-4 py-3 bg-white pr-12 text-base md:text-lg"
                        />
                        <span className='absolute right-[4px] top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={() => toggleVisibility(confirmRef, eyeCfmRef)}>
                            <img ref={eyeCfmRef} className='p-1' width={26} src="icons/eyecross.png" alt="toggle confirm password visibility" />
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-70 rounded-full px-6 md:px-8 py-3 text-white border border-green-900 text-base md:text-lg font-medium"
                    >
                        {isSubmitting ? 'Creating account…' : 'Sign up'}
                    </button>

                    <div className="text-center mt-4 text-sm text-slate-700">
                        Already have an account?{' '}
                        <button type="button" className="text-fuchsia-700 hover:underline" onClick={onSwitchToLogin}>Sign in</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Signup


