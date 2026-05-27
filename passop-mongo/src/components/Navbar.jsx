import React from 'react'

function Navbar({ currentUser, onLogout, searchQuery, setSearchQuery, onSignIn, onSignUp, showLandingNav }) {
    const getDisplayName = () => {
        if (!currentUser) return ''
        const fromName = (currentUser.name || '').trim()
        if (fromName) return fromName
        const email = (currentUser.email || '').trim()
        return email.split('@')[0]
    }

    const getInitials = () => {
        const name = getDisplayName()
        if (!name) return '?'
        const parts = name.trim().split(/\s+/)
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
    }

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return (
        <nav className='sticky top-0 z-50 bg-gradient-to-r from-sky-500/90 to-sky-400/90 backdrop-blur-md border-b border-sky-300/30 text-white shadow-lg'>
            <div className='mycontainer flex justify-between md:justify-around items-center px-4 py-4 md:py-5 h-14'>
                <div className="logo font-bold text-white text-xl md:text-2xl cursor-pointer" onClick={() => showLandingNav && scrollToSection('home')}>
                    <span className='text-black'>Lock</span><span className='text-orange-500'>Verse</span>
                </div>
                
                {/* Navigation Links for Landing Page */}
                {showLandingNav && !currentUser && (
                    <ul className='hidden md:flex gap-8'>
                        <li>
                            <button onClick={() => scrollToSection('home')} className='text-white hover:text-orange-500 transition-colors duration-300 font-medium'>
                                Home
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('about')} className='text-white hover:text-orange-500 transition-colors duration-300 font-medium'>
                                About
                            </button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection('contact')} className='text-white hover:text-orange-500 transition-colors duration-300 font-medium'>
                                Contact
                            </button>
                        </li>
                    </ul>
                )}

                {/* Search Bar for Authenticated Users */}
                {currentUser && (
                    <div className='hidden md:flex items-center gap-4'>
                        <div className='relative'>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search username..."
                                className='rounded-full border border-black bg-white/30 backdrop-blur-md text-white placeholder-white/70 px-4 py-2 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                                list="password-suggestions"
                            />
                            <datalist id="password-suggestions">
                                {/* Autocomplete suggestions will be populated dynamically if needed */}
                            </datalist>
                            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                )}

            <div className='flex items-center gap-3 md:gap-4'>
                {currentUser ? (
                    <>
                        <div className='hidden md:flex items-center max-w-[280px] rounded-full bg-gradient-to-r from-white/15 to-white/10 dark:from-white/15 dark:to-white/10 px-4 py-2 ring-2 ring-white/30 backdrop-blur-md text-white dark:text-white font-medium text-sm truncate shadow-lg' title={`Hello, ${getDisplayName()}`}>
                            <span className='truncate'>Hello, {getDisplayName()}</span>
                        </div>
                        <button onClick={onLogout} className='text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-full flex justify-center items-center ring-1 ring-white/40 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform'>
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </>
                ) : showLandingNav ? (
                    <>
                        <button onClick={onSignIn} className='text-white hover:text-orange-500 px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base font-semibold transition-all duration-300'>
                            Sign In
                        </button>
                        <button onClick={onSignUp} className='text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full px-4 md:px-6 py-2 md:py-2.5 text-sm md:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform'>
                            Sign Up
                        </button>
                    </>
                ) : null}
            </div>
            </div>
        </nav>
    )
}

export default Navbar
