import React from 'react'

function Navbar() {
    return (
        <nav className='bg-slate-700 text-white'>
            <div className='mycontainer  flex justify-around items-center px-4 py-5 h-14'>
                <div className="logo font-bold text-white text-2xl">
                    <span>Lock</span><span className='text-orange-500'>Verse</span>
                </div>
            {/* <ul>
                <li className='flex gap-4'>
                    <a className='hover:font-bold' href="/">Home</a>
                    <a className='hover:font-bold' href="#">About</a>
                    <a className='hover:font-bold' href="#">Contact</a>
                </li>
            </ul> */}
            <button className='text-white bg-black my-5 rounded-full flex justify-between items-center ring-white ring-1c'>
                <img className='invert w-10 p-1' src="icons/github.svg" alt="github logo"/>
                <span className='font-bold px-2'>Github</span>
            </button>
            </div>
        </nav>
    )
}

export default Navbar
