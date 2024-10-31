import React from 'react'

const Card = ({ title, datas }) => {
  console.log(datas)
  return (
    <div className='grid justify-center items-end w-40 h-20 p-3 rounded-xl shadow-md bg-white'>
      <p className='text-center text-xl font-bold'>{datas.toLocaleString()}</p>
      <p className='text-center text-xs'>{title}</p>
    </div>
  )
}

export default Card