"use client"
import { getResume } from '@/actions/resume'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from "react-markdown";
import { ClipLoader } from 'react-spinners';
import remarkGfm from "remark-gfm"

const ResumePreview = () => {

  const [markdown, setMarkdown] = useState<string | undefined>("")
  const [loading, setloading] = useState(false)

  useEffect(() => {
    async function fetchResume() {
      try {
        setloading(true)
        const response = await getResume();
        // console.log(response);

        setMarkdown(response?.content)
      } catch (error) {
        console.error(error)
      } finally {
        setloading(false)
      }
    }
    fetchResume();
  }, [])

  if (loading) return <div className='w-full h-56 flex justify-center items-center'><ClipLoader size={"25px"} color='white' /> Loading Preview...</div>

  return (
    <div className="bg-gray-100 min-h-screen p-8 text-black font-sans w-[85%] mx-auto">
      <div className="prose prose-invert max-w-none ">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default ResumePreview