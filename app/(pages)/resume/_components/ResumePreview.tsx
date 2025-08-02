"use client"
import { getResume } from '@/actions/resume'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from "react-markdown";
import { ClipLoader } from 'react-spinners';

const ResumePreview = () => {

  const [markdown, setMarkdown] = useState<string | undefined>("")
  const [loading,  setloading] = useState(false)

  useEffect(() => {
    async function fetchResume() {
      try {
        setloading(true)
        const response = await getResume();
        // console.log(response);
        
        setMarkdown(response?.content)
      } catch (error) {
        console.error(error)
      } finally{
        setloading(false)
      }
    }
    fetchResume();
  },[])

  if(loading) return <div className='w-full h-56 flex justify-center items-center'><ClipLoader size={"25px"} color='white'/> Loading Preview...</div>

  return (
     <div className="w-full flex justify-center py-10 bg-gray-900">
    <div className="bg-white text-black shadow-xl px-8 py-10 w-[794px] min-h-[1123px]">
      {/* A4 paper size is approx 794x1123 px */}
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  </div>
  )
}

export default ResumePreview