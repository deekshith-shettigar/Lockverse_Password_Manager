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
                                LockVerse was created with a simple yet powerful mission: to make password management effortless, organized, and secure for everyone. In today's digital world, we log into countless websites, games, and applications each requiring unique usernames and passwords, and remembering all of them can be difficult and overwhelming. LockVerse solves this problem by providing a safe and user-friendly space to securely store and manage all your login information in one place. We believe that protecting your online identity shouldn't be complicated with LockVerse, you can enjoy security, simplicity, and convenience while focusing on what truly matters.
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-3">Why Choose Us?</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">🖥️</span>
                                    <span><strong className="text-white">User-Friendly Interface:</strong> LockVerse offers a clean and simple design that makes it easy to store, view, and manage all your login details.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">🌐</span>
                                    <span><strong className="text-white">Cross-Platform Access:</strong> Access your saved usernames and passwords from anywhere, anytime.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">💾</span>
                                    <span><strong className="text-white">Reliable Storage:</strong> All your website URLs, usernames, and passwords are safely stored in a secure database using MongoDB.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">⚡</span>
                                    <span><strong className="text-white">Fast and Efficient:</strong> Built with React and Node.js, LockVerse provides a smooth and responsive experience.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-2xl mr-3">🗂️</span>
                                    <span><strong className="text-white">Organized Management:</strong> Keep all your login information neatly organized in one place, so you never lose track of your credentials again.</span>
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
                                    Built with the latest security standards and continuously updated to protect against 
                                    emerging threats. Your digital life deserves nothing less than the best protection.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
                                <div className="text-gray-400">Passwords Stored</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">24/7</div>
                                <div className="text-gray-400">Customer Help</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10 text-center">
                                <div className="text-3xl font-bold text-orange-500 mb-2">1-Click</div>
                                <div className="text-gray-400">Access Logins</div>
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
