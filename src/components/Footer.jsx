import React from 'react'

const Footer = () => {
    return (
        <div className='bg-gradient-to-r from-slate-700 to-slate-700 backdrop-blur-md text-white flex flex-col justify-center items-center w-full py-4 shadow-lg'>
            <div className="logo font-bold text-white text-2xl">
                <span className='text-black'>Lock</span><span className='text-orange-500'>Verse</span>
            </div>
            <div className='flex justify-center items-center mt-2'>
                Copyright &copy; Deekshith Shettigar - All rights reserved
            </div>

        </div>
    )
}

export default Footer
