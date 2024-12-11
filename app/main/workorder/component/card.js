'use client'

import { useState } from "react"
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";




const Card = ({ datas }) => {

  const [dropdown, setDropdown] = useState(false)

  if (!datas.length >1) {
    return <div>No data.</div>
  }

  const customer_name = datas.name
    ? datas.name
        .split(' ')
        .map(part => (part.length > 2 ? `${part.slice(0, 2)}***` : part))
        .join(' ')
    : ''

  const color = 
  datas.status == 'Complete' ? 'text-green-700 bg-green-100' 
  : datas.status == 'Progress' ? 'text-orange-700 bg-orange-100' 
  : datas.status == 'Awaiting' ? 'text-yellow-700 bg-yellow-100' : 'text-slate-700 bg-slate-100'


  return (
    <div className='flex justify-center py-4'>
      <div className='grid w-[92vw] p-2 shadow-lg rounded-xl bg-white'>

        <div>
          <table className='wo-table table-fixed w-full px-2'>
            <tbody>
              <tr>
                <td>
                  <h3 className='text-[10px]'>Customer Name</h3>
                  <h2 className='font-bold text-sm text-ellipsis overflow-hidden whitespace-nowrap'>{customer_name}</h2>
                </td>
                <td className='text-center'>
                  <h2 className={`py-1 mx-4 text-sm font-bold rounded-lg shadow-md ${color}`}>{datas.status.toUpperCase()}</h2>
                </td>
              </tr>
              <tr>
                <td>Order Id</td>
                <td className='text-right text-ellipsis overflow-hidden whitespace-nowrap'>{datas.order_number}</td>
              </tr>
              <tr>
                <td>Schedule Date</td>
                <td className='text-right text-ellipsis overflow-hidden whitespace-nowrap'>{datas.order_scheduled_date}</td>
              </tr>
              <tr>
                <td>City</td>
                <td className='text-right text-ellipsis overflow-hidden whitespace-nowrap'>{datas.city}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Homepass ID</td>
                <td className='text-right'>{datas.homepass_id}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Site Name</td>
                <td className='text-right'>{datas.sitename}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Location</td>
                <td className='text-right'>{datas.address}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Order Completed</td>
                <td className='text-right'>{datas.order_completed_date ?? '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button 
          className='flex justify-center items-center gap-4 py-1 m-4 mb-2 text-xs rounded-xl shadow-sm bg-amtblue/10'
          onClick={() => setDropdown(!dropdown)}
        >
          View Order Details {dropdown ? <FaAnglesUp size={8} /> : <FaAnglesDown size={8} /> }
        </button>
        
      </div>
      
      
    </div>
  )
}

export default Card