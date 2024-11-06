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
    <div className='w-full h-full bg-gradient-to-b from-amtblue/80 via-amtblue to-black'>
      <div className='w-full h-screen overflow-hidden'>
        <MapContainer />
      </div>
    </div>
  )
}

export default CheckCoverage