
"use client"
import { cn } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa6'

const SigninPage = () => {
  return (
    <div className="min-h-screen w-full flex">

      <div className="logo text-3xl font-black absolute top-0 left-0 text-gray-300 z-50 mt-12 ml-8">XtraMilezz</div>

      <div className="relative image w-2/3 h-screen hidden lg:block">
        <Image
          src="/login_image.png" // public folder image
          alt="Hero Banner"
          fill // fills parent container
          className="object-cover object-left"
          priority // preload on page load
        />
        <div className="overlay flex items-center flex justify-center flex-col h-full w-full absolute top-0 left-0 bg-black/50 z-40 backdrop-blur-xs">

          <h2 className='text-9xl font-black bg-gradient-to-br from-gray-600 via-gray-200 to-gray-800 bg-clip-text text-transparent '>Prepare. <br />Apply. <br />Grab.</h2>
        </div>

      </div>

      <div className="authcard w-full lg:w-1/3 h-screen p-8 flex flex-col gap-2 justify-center itmes-center">

          <div
            className={cn(
              "absolute inset-0 -z-50",
              "[background-size:20px_20px]",
              "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
              "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
            )}
          />
          {/* Radial gradient for the container to give a faded look */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
          <h2 className='text-2xl font-bold text-center mb-8 animate-bounce'>Sign In to start your Prep.</h2>


          <button
            className="bg-white/30 text-white py-6 rounded mb-4 w-full flex items-center justify-center gap-2 cursor-pointer cursor-pointer hover:-translate-y-1 duration-200"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <FaGoogle size={"24px"} /><span>Continue with Google</span>
          </button>
          <button
            className="bg-slate-800/60 text-white px-6 py-6 rounded w-full flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-1 duration-200"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            <FaGithub size={"24px"} /><span>Continue with GitHub</span>
          </button>

      </div>

    </div>
  )
}

export default SigninPage
