"use client"
import React, { useEffect } from 'react'
import ResumeBuilder from './_components/ResumeBuilder';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Resume = () => {

  const router = useRouter()
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  return (
    <div className='w-full lg:w-[85%] mx-auto pt-8 px-8'>
        <ResumeBuilder />
    </div>
  )
}

export default Resume