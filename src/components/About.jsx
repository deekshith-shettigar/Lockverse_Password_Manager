import React from 'react'

function About() {
    return (
        <section id="about" className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About <span className="text-white">Lock</span><span className="text-orange-500">Verse</span>
                    </h2>
                    <p className="text-xl text-gray-400">
                        Your Safe Space for All Your Logins
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                            <p className="text-gray-400 leading-relaxed">
                                LockVerse was built to solve a real problem — too many passwords, too easy to forget them, and too risky to reuse them. It's a full-stack personal password manager where you sign up once, verify your email, and get a private encrypted vault to store all your website credentials. Every entry is tied to your account only, protected by bcrypt hashing and secure server-side sessions. Whether you're managing logins for work, social media, or banking, LockVerse keeps them organised, accessible, and safe — all in one place.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-3">Why Choose Us?</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">🔐</span>
                                    <span><strong className="text-white">bcrypt Password Hashing:</strong> Your master password is never saved in plain text — it's hashed before storage so only you know it.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">✉️</span>
                                    <span><strong className="text-white">Email Verification:</strong> Every new account is verified before access is granted, keeping your vault protected from the start.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">🔑</span>
                                    <span><strong className="text-white">OTP-Based Password Reset:</strong> Forgot your password? A time-limited code is sent to your email — no security questions, no guesswork.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">🛡️</span>
                                    <span><strong className="text-white">Private Vault:</strong> Your saved credentials are strictly tied to your account — no one else can ever view or access your entries.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">⚡</span>
                                    <span><strong className="text-white">Fast & Responsive:</strong> Snappy on every device — whether you're on desktop or mobile, LockVerse feels smooth and instant.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-orange-500/20 to-purple-500/20 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-orange-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Security You Can Trust</h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Your master password is hashed with <strong className="text-orange-400">bcrypt</strong> and never stored in plain text. Sessions are managed server-side so your vault is always scoped to your account only — no one else can ever access your data, not even us.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">bcrypt</div>
                                <div className="text-gray-400">Password Hashing</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">OTP</div>
                                <div className="text-gray-400">Secure Password Reset</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">1-Click</div>
                                <div className="text-gray-400">Copy Credentials</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">Free</div>
                                <div className="text-gray-400">No Hidden Costs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About