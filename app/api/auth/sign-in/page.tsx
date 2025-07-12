
"use client"
import { signIn } from 'next-auth/react'
import React from 'react'

const SigninPage = () => {
  return (
    <div>
        <button onClick={() => signIn("google", {callbackUrl:"/dashboard"})}>continue with google</button>
        <button onClick={() => signIn("github", {callbackUrl:"/dashboard"})}>continue with github</button>
    </div>
  )
}

export default SigninPage