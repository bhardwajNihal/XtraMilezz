import React from 'react'
import { checkUser } from '@/lib/checkuser';
import MenuOptions from './menuOptions';
import Image from 'next/image';


const Header = async() => {

    await checkUser();

    return (
        <div className='h-16 sticky bg-black/40 z-50 top-4 shadow-md backdrop-blur shadow-gray-700 w-[90%] mt-2 px-8 sm:px-12 rounded-full mx-auto flex justify-between items-center'>
            
            <div className="relative logo h-[60%] w-44 sm:w-50 bg-red-500">
                <Image src={"/logo.png"} alt='Xtramilezz_logo' fill/>
            </div>

            <MenuOptions/>
            
        </div>
    )
}

export default Header