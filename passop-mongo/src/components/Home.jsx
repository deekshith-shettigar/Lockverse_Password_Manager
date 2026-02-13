import React from 'react'

function Home() {
    return (
        <section id="home" className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
                <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-white">
                        Welcome to <span className="text-white">Lock</span><span className="text-orange-500">Verse</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                        Your Simple and Secure Password Companion
                    </p>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Tired of remembering multiple usernames and passwords? LockVerse makes it easy. Store all your login details safely in one place with a simple design and strong security.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                        <a href="#about" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                            Learn More
                        </a>
                        <a href="#contact" className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 border border-white/30">
                            Get Started
                        </a>
                    </div>
                </div>
                
                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Secure Storage</h3>
                        <p className="text-gray-400">
                            All your passwords are stored safely in the cloud, accessible whenever you need them.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Easy Access</h3>
                        <p className="text-gray-400">
                            Quickly search and retrieve your passwords whenever you need them with our intuitive interface.
                        </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-all duration-300">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                        <p className="text-gray-400">
                            We never store your master password. Your data is yours and yours alone.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home
