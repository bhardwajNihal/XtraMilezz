"use client"
import { useSession } from 'next-auth/react'
import React from 'react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {

  const router = useRouter()
  const session = useSession();
  console.log(session);
  
  if(session.status==="unauthenticated"){
    router.push("/sign-in")
  }

  return (
    <div>welcome,  {session.data?.user?.name}</div>
  )
}

export default Dashboard