import React from 'react'
import Link from 'next/link';
import { checkUser } from '@/lib/checkuser';

const Header = async() => {

    await checkUser();

    return (
        <div className='h-16 sticky bg-black/40 z-50 top-4 shadow-md backdrop-blur shadow-gray-700 w-[90%] mt-2 px-8 sm:px-12 rounded-full mx-auto flex justify-between items-center'>
            <div className="logo font-black text-lg sm:text-xl">XtraMilezz</div>

            <div className="menu flex items-center">
                <ul className='flex gap-2 lg:gap-4 items-center hidden sm:flex text-sm text-gray-400'>
                    <a href="#features"><li className='cursor-pointer hover:text-gray-300 duration-300'>Features</li></a>
                    <a href="#functions"><li className='cursor-pointer hover:text-gray-300 duration-300'>Functions</li></a>
                    <a href="#testimonials"><li className='cursor-pointer hover:text-gray-300 duration-300'>Testimonials</li></a>
                    <a href="#faqs"><li className='cursor-pointer hover:text-gray-300 duration-300'>FAQs</li></a>
                </ul>

                <Link href={"/sign-in"}>
                    <button
                        className="inline-flex py-2 px-4 sm:ml-5 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:text-gray-200 cursor-pointer">
                        Sign In
                    </button>
                </Link>

            </div>
        </div>
    )
}

export default Header