import React from 'react'

const Footer = () => {
    return (
        <div className='bg-slate-800 text-white flex flex-col justify-center items-center w-full'>
            <div className="logo font-bold text-white text-2xl">
                <span>Lock</span><span className='text-orange-500'>Verse</span>
            </div>
            <div className='flex justify-center items-center'>
                Created with <img className='w-7 m-2' src="icons/heart.png" alt="" /> by Deekshith
            </div>

        </div>
    )
}

export default Footer
