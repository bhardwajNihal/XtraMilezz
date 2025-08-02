import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder';

const Resume = async() => {

  return (
    <div className='w-full lg:w-[85%] mx-auto pt-8 px-8'>
        <ResumeBuilder />
    </div>
  )
}

export default Resume