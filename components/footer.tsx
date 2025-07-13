"use client"
import React from 'react'
import { Github, Linkedin } from 'lucide-react'
import { FaXTwitter } from "react-icons/fa6";
import { useRouter } from 'next/navigation';

const Footer = () => {

    const router = useRouter();

    return (
        <footer className="h-20 backdrop-blur bg-black/60 space-y-2 border-t border-gray-600 flex flex-col justify-center items-center text-sm gap-2 text-gray-400">
            <div className="flex gap-2 sm:gap-6 justify-center items-center">
                <p>Made with ❤️ by Nihal Bhardwaj.</p>
                <a target="_blank" href="https://x.com/bhardwajnihal21" ><FaXTwitter className="hover:text-blue-400 text-lg" /></a>
                <a target="_blank" href="https://github.com/bhardwajNihal"><Github size={"18px"} className="hover:text-gray-500" /></a>
                <a target="_blank" href="https://www.linkedin.com/in/nihal-bhardwaj-8397212b8/"><Linkedin size={"18px"} className="hover:text-blue-600" /></a>
            </div>
            <div className='flex gap-4 items-center'>
                <p className='text-center'>© 2025 XtraMilezz. All rights reserved.</p>
                <p
                    onClick={() => router.push("/privacy-policy")}
                    className='text-xs text-blue-500 hover:underline cursor-pointer'>Privacy Policy</p>
            </div>
        </footer>
    )
}

export default Footer