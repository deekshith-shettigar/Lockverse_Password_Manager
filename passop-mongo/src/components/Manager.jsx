import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import 'react-toastify/dist/ReactToastify.css';

const Manager = ({ currentUser, searchQuery }) => {
    const ref = useRef()
    const passwordRef = useRef()
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setPasswordArray] = useState([])
    const [filteredPasswords, setFilteredPasswords] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        const email = (currentUser?.email || '').toLowerCase()
        const filtered = email ? passwords.filter(p => (p.userEmail || '').toLowerCase() === email) : []
        setPasswordArray(filtered)
    }


    useEffect(() => {
        getPasswords()
    }, [currentUser])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredPasswords(passwordArray)
        } else {
            const filtered = passwordArray.filter(item =>
                item.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.username.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredPasswords(filtered)
        }
    }, [passwordArray, searchQuery])




    const copyText = (text) => {
        toast.success('Copied to clipboard!', { autoClose: 2000 });
        navigator.clipboard.writeText(text)
    }

    const showPassword = () => {
        passwordRef.current.type = "text"
        console.log(ref.current.src)
        if (ref.current.src.includes("icons/eye.png")) {
            ref.current.src = "icons/eyecross.png"
            passwordRef.current.type = "password"
        }
        else {
            passwordRef.current.type = "text"
            ref.current.src = "icons/eye.png"
        }

    }

    const savePassword = async () => {
        const siteOk = (form.site || '').trim().length > 3
        const usernameOk = (form.username || '').trim().length > 3
        const passwordOk = (form.password || '').trim().length > 3

        if (!siteOk || !usernameOk || !passwordOk) {
            toast.error('Please fill all fields with at least 4 characters', { autoClose: 2000 })
            return
        }

        if (siteOk && usernameOk && passwordOk) {

            const newId = uuidv4(); // ✅ Generate once

            // If editing, delete old entry
            if (form.id) {
                await fetch("http://localhost:3000/", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: form.id })
                });
            }

            // Add to state with user scoping
            const userEmail = currentUser?.email || ''
            setPasswordArray([...passwordArray, { ...form, id: newId, userEmail }]);

            // Save to MongoDB
            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, id: newId, userEmail: currentUser?.email || '' })
            });

            // Reset form
            setform({ site: "", username: "", password: "" });
            toast.success('Password saved!', { autoClose: 2000 });
        }
    };
    const deletePassword = async (id) => {
        if (confirm("Do you really want to delete this password?")) {
            // Remove from UI
            setPasswordArray(passwordArray.filter(item => item.id !== id));

            // Remove from DB
            await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id })
            });

            toast.info('Password Deleted!', { autoClose: 2000 });
        }
    }


    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setPasswordArray(passwordArray.filter(item => item.id !== id))
    }


    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
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
            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>
            <div className=" p-3 md:p-6 md:mycontainer min-h-[88.2vh] ">
                <h1 className='text-3xl md:text-4xl font-bold text-center'>
                    <span className='text-white'>Lock</span><span className='text-orange-500'>Verse</span>
                </h1>
                <p className='text-white text-base md:text-lg text-center mt-2'>Your own Password Manager</p>
                <div className="flex flex-col p-2 md:p-4 text-black gap-4 md:gap-6 items-center w-full max-w-3xl mx-auto">
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' className='rounded-full border border-green-500 w-full p-3 md:p-4 py-2 md:py-3 text-sm md:text-lg' type="text" name="site" id="site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-4 md:gap-6">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-3 md:p-4 py-2 md:py-3 text-sm md:text-lg' type="text" name="username" id="username" />
                        <div className="relative w-full md:w-1/2">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-3 md:p-4 py-2 md:py-3 pr-10 md:pr-12 text-sm md:text-lg' type="password" name="password" id="password" />
                            <span className='absolute right-[3px] top-1/2 transform -translate-y-1/2 cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={30} src="icons/eyecross.png" alt="eye" />
                            </span>
                        </div>

                    </div>
                    <button onClick={savePassword} className='flex justify-center items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full px-4 md:px-8 py-2 md:py-3 w-full md:w-fit border border-green-900 text-white text-sm md:text-lg font-medium'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover" >
                        </lord-icon>
                        Save Password</button>


                </div>

                <div className="passwords w-full px-2 md:px-0">
                    <h2 className='font-bold text-xl md:text-2xl py-4 text-white'>Your Passwords</h2>
                    {filteredPasswords.length === 0 && passwordArray.length === 0 && <div className='text-white text-sm md:text-base'> No passwords to show</div>}
                    {filteredPasswords.length === 0 && passwordArray.length > 0 && searchQuery.trim() !== "" && <div className='text-white text-sm md:text-base'> No passwords match your search</div>}
                    {filteredPasswords.length != 0 &&
                    <>
                    {/* Responsive table */}
                    <div className='w-full overflow-x-auto rounded-md ring-1 ring-green-300/40 mb-10 bg-green-50'>
                        <table className="w-full border-collapse text-xs sm:text-sm md:text-base bg-green-50">
                            <thead>
                                <tr className='bg-green-800'>
                                    <th className='py-2 px-2 sm:px-3 text-left text-white border-r border-green-700'>Site</th>
                                    <th className='py-2 px-2 sm:px-3 text-left text-white border-r border-green-700'>Username</th>
                                    <th className='py-2 px-2 sm:px-3 text-left text-white border-r border-green-700'>Password</th>
                                    <th className='py-2 px-2 sm:px-3 text-center text-white'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-50'>
                                {filteredPasswords.map((item, index) => {
                                    return <tr key={index} className='align-top border-b border-green-300'>
                                        <td className='py-2 px-2 sm:px-3 bg-white/50 border-r border-green-300'>
                                            <div className='flex items-center justify-start gap-1 sm:gap-2'>
                                                <a href={item.site} target='_blank' className='truncate block max-w-[40vw] sm:max-w-[200px] md:max-w-none text-xs sm:text-sm md:text-base'>{item.site}</a>
                                                <button className='lordiconcopy size-5 sm:size-6 cursor-pointer flex-shrink-0 p-0.5' onClick={() => { copyText(item.site) }} aria-label='Copy site'>
                                                    <lord-icon
                                                        style={{ "width": "100%", "height": "100%" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </button>
                                            </div>
                                        </td>
                                        <td className='py-2 px-2 sm:px-3 bg-white/50 border-r border-green-300'>
                                            <div className='flex items-center justify-start gap-1 sm:gap-2'>
                                                <span className='truncate max-w-[35vw] sm:max-w-[150px] md:max-w-none text-xs sm:text-sm md:text-base'>{item.username}</span>
                                                <button className='lordiconcopy size-5 sm:size-6 cursor-pointer flex-shrink-0 p-0.5' onClick={() => { copyText(item.username) }} aria-label='Copy username'>
                                                    <lord-icon
                                                        style={{ "width": "100%", "height": "100%" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </button>
                                            </div>
                                        </td>
                                        <td className='py-2 px-2 sm:px-3 bg-white/50 border-r border-green-300'>
                                            <div className='flex items-center justify-start gap-1 sm:gap-2'>
                                                <span className='text-xs sm:text-sm md:text-base'>{"*".repeat(Math.min(item.password.length, 8))}</span>
                                                <button className='lordiconcopy size-5 sm:size-6 cursor-pointer flex-shrink-0 p-0.5' onClick={() => { copyText(item.password) }} aria-label='Copy password'>
                                                    <lord-icon
                                                        style={{ "width": "100%", "height": "100%" }}
                                                        src="https://cdn.lordicon.com/iykgtsbt.json"
                                                        trigger="hover" >
                                                    </lord-icon>
                                                </button>
                                            </div>
                                        </td>
                                        <td className='py-2 px-2 sm:px-3 bg-white/50 text-center'>
                                            <div className='flex items-center justify-center gap-1 sm:gap-2'>
                                                <button className='cursor-pointer hover:scale-110 transition' onClick={() => { editPassword(item.id) }} aria-label='Edit'>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/gwlusjdu.json"
                                                        trigger="hover"
                                                        style={{ "width": "20px", "height": "20px" }}>
                                                    </lord-icon>
                                                </button>
                                                <button className='cursor-pointer hover:scale-110 transition' onClick={() => { deletePassword(item.id) }} aria-label='Delete'>
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/skkahier.json"
                                                        trigger="hover"
                                                        style={{ "width": "20px", "height": "20px" }}>
                                                    </lord-icon>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                    </>
                    }
                </div>
            </div>

        </>
    )
}

export default Manager