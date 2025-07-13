import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'

const PagesLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <>
    <Header/>
    <main className='min-h-screen w-full'>{children}</main>
    <Footer/>
    </>
  )
}

export default PagesLayout