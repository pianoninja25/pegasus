'use client'

// import { signOut, useSession } from 'next-auth/react'
// import { useState } from 'react'
// import { Image } from 'antd'
// import { IoLogOut } from "react-icons/io5"

import MapContainer from '../../components/map-container'


const CheckCoverage = () => {
  // const { data: session, status} = useSession()
  // const [toggle, setToggle] = useState(true)
  



  return (
    <div className='flex flex-col font-quicksand'>
      <div className='w-full h-full bg-gradient-to-b from-amtblue/80 via-amtblue to-black'>
        
        



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
            <div className='w-full h-screen overflow-hidden'>
              {/* {session && <MapContainer toggle={toggle} />} */}
              <MapContainer />
            </div>
          </div>




      </div>
      
    </div>
  )
}

export default CheckCoverage