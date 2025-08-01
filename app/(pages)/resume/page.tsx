import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder';
import { getResume } from '@/actions/resume';

const Resume = async() => {

    // fetching existing resume
    const resumeContent = await getResume();

  return (
    <div className='w-full lg:w-[85%] mx-auto pt-8 px-8'>
        <ResumeBuilder initialContent={resumeContent}/>
    </div>
  )
}

export default Resume