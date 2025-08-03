
"use client"
import { BarChart3, LogOut, Wrench } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select"


const MenuOptions = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [avatarSelected, setAvatarSelected] = useState(false);
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
                : <div className='flex items-center gap-4'>
                    <div
                        onClick={() => router.push("/dashboard")}
                        className="insights bg-gray-300 text-black cursor-pointer gap-2 hover:bg-gray-400 px-2 py-1.5 rounded flex items-center">
                        <BarChart3 size={"16px"} color='black' />
                        <span className='hidden md:block'>Industry Insights</span>
                    </div>
                    <div className="growth-tools">
                        <Select onValueChange={(value) => {
                            switch (value) {
                                case "interview":
                                    router.push("/interview");
                                    break;
                                case "resume":
                                    router.push("/resume");
                                    break;
                                case "cover-letter":
                                    router.push("/cover-letter");
                                    break;
                            }
                        }}>
                            <SelectTrigger className="w-fit text-sm sm:text-normal">
                                <Wrench size={"15px"} color='white' />
                                <span className="hidden md:inline text-white">Growth Tools</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="interview">Mock Interview</SelectItem>
                                    <SelectItem value="resume">Resume Builder</SelectItem>
                                    <SelectItem value="cover-letter">Generate Cover Letter</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="relative">
                        <span
                            onClick={() => setAvatarSelected(prev => !prev)}
                            className='avatar h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center font-semibold cursor-pointer hover:bg-gray-600'>
                            {(session.data?.user?.name)?.slice(0, 1).toUpperCase()}
                        </span>

                        {avatarSelected && <div className='absolute p-4 py-8 text-center top-10 right-0 h-fit w-fit bg-zinc-950 shadow-lg shadow-zinc-800 rounded'>

                            <h2 className='text-lg font-normal'>{session.data?.user?.name}</h2>
                            <h3 className='text-sm font-normal text-gray-400 text-wrap'>{session.data?.user?.email}</h3>

                            <div className='flex justify-center'>
                                <button
                                    onClick={() => signOut({callbackUrl:"/"})}
                                    className='border border-gray-400 cursor-pointer hover:bg-gray-900 p-1 px-3 mt-4 rounded flex gap-1 items-center'><LogOut size={"16px"} color='gray' />Logout</button>
                            </div>
                        </div>}
                    </div>

                </div>
            }
        </>
    )
}

export default MenuOptions