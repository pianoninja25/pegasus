'use client'

import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { Image } from 'antd'
import { IoLogOut } from "react-icons/io5"

import Header from './components/header'
import Jatayu from './jatayu/page'


const Home = () => {
  const { data: session, status} = useSession()
  const [toggle, setToggle] = useState(true)
  

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };


  return (
    <div className='w-full h-full grid font-quicksand bg-gradient-to-b from-amtblue/80 via-amtblue to-black'>
      
      <Header 
        getGreeting={getGreeting()} 
        user={session?.user.client_name} 
        toggle={toggle} 
        setToggle={setToggle} 
      />



      {/* <div className='absolute top-6 right-6 flex gap-6 z-[999]'>
        <Image 
          src={`/unifiber-text.svg`} 
          width={100} 
          alt="unifiber" 
          preview={false}
        />
        
        <button 
          onClick={() => signOut()} 
          className='flex items-center justify-around gap-2 w-fit h-fit p-2 px-3 text-sm text-white rounded-md shadow-sm bg-amtorange/80 hover:bg-amtorange'
        >
          Logout 
          <IoLogOut size={20} />
        </button>

      </div> */}


        <div className=''>
          {/* <h1 className='text-white'>MAP</h1> */}
          <div className='w-full h-[48rem] overflow-hidden'>
            {session && <Jatayu toggle={toggle} />}
          </div>
        </div>


    </div>
  )
}

export default Home