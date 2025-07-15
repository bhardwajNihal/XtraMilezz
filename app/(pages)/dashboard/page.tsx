"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {ClipLoader} from "react-spinners"

const Dashboard = () => {

  const router = useRouter()
  const {data:session, status} = useSession();
  console.log(session);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if(status==="loading") return <div className='min-h-screen w-full flex justify-center items-center'><ClipLoader size={"30px"} color='gray'/></div>

  return (
    <div>welcome,  {session?.user?.name}</div>
  )
}

export default Dashboard