import React from 'react'
import { FaMapMarkerAlt } from "react-icons/fa";
import { CiViewTable } from "react-icons/ci";

const Toggle = ({ toggle, setToggle }) => {
  return (
    <div
      onClick={() => setToggle(!toggle)} 
      className='w-fit mt-14 mx-4 p-2 rounded-full shadow-md opacity-30 animate-slowBounce transition-opacity duration-500 cursor-pointer bg-white hover:opacity-100'
    >
      {toggle 
        ? <CiViewTable size={20} color='#f58220' />
        : <FaMapMarkerAlt size={20} color='#f58220' />
      }
      
    </div>
  )
}

export default Toggle