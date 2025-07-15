
"use client"
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const MenuOptions = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const session = useSession();
    const router = useRouter();

    useEffect(() => {
        setIsAuthenticated(session.status === "authenticated" ? true : false);
    }, [session.status])

    return (
        <>
        {!isAuthenticated 
        ? <div className="menu flex items-center">
            <ul className='flex gap-2 lg:gap-4 items-center hidden sm:flex text-sm text-gray-400'>
                <a href="#features"><li className='cursor-pointer hover:text-gray-300 duration-300'>Features</li></a>
                <a href="#functions"><li className='cursor-pointer hover:text-gray-300 duration-300'>Functions</li></a>
                <a href="#testimonials"><li className='cursor-pointer hover:text-gray-300 duration-300'>Testimonials</li></a>
                <a href="#faqs"><li className='cursor-pointer hover:text-gray-300 duration-300'>FAQs</li></a>
            </ul>
            <button
                onClick={() => router.push("/sign-in")}
                className="inline-flex py-2 px-4 sm:ml-5 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:text-gray-200 cursor-pointer">
                Sign In
            </button>
        </div>
        : <div className='text-white'>
            <span>{session.data?.user?.name}</span>
            <button className='border border-gray-500 py-1 px-4 ml-4 rounded' onClick={() => signOut({callbackUrl:"/"})}>Logout</button>
        </div>
        }
        </>
    )
}

export default MenuOptions