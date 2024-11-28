'use client'

import { useState } from "react"
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6";




const Card = ({ datas }) => {

  const [dropdown, setDropdown] = useState(false)

  if (!datas.length >1) {
    return <div>No data.</div>
  }

  return (
    <div className='flex justify-center py-4'>
      <div className='grid w-[92vw] p-2 shadow-lg rounded-xl bg-white'>

        <div>
          <table className='wo-table table-fixed w-full px-2'>
            <tbody>
              <tr>
                <td>
                  <h3 className='text-[10px]'>Customer ID</h3>
                  <h2 className='font-bold text-sm text-ellipsis overflow-hidden whitespace-nowrap'>{datas.customer_id}</h2>
                </td>
                <td className='text-center'>
                  <h2 className={`py-1 mx-4 text-sm font-bold rounded-lg shadow-md ${datas.ticket_color}`}>{datas.ticket_status.toUpperCase()}</h2>
                </td>
              </tr>
              <tr>
                <td className='w-2/5'>Ticket ID</td>
                <td className='w-3/5 text-right'>{datas.amt_ticket_id}</td>
              </tr>
              <tr>
                <td className='w-2/5'>Tier 1</td>
                <td className='w-3/5 text-right'>{datas.category}</td>
              </tr>

              <tr className={dropdown ? '' : 'hidden'}>
                <td className='w-2/5'>Tier 2</td>
                <td className='w-3/5 text-right'>{datas.subcategory}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td className='w-2/5'>Tier 3</td>
                <td className='w-3/5 text-right'>{datas.code}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Close Date</td>
                <td className='text-right'>{datas?.closed_at?.replace('T', ' ')}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Rootcause</td>
                <td className='text-right'>{datas.rca}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td>Action</td>
                <td className='text-right'>{datas.closed_code}</td>
              </tr>
              <tr className={dropdown ? '' : 'hidden'}>
                <td 
                  colSpan="2" 
                  dangerouslySetInnerHTML={{ __html: datas.detail }} 
                  className="overflow-x-auto" 
                />
              </tr>

            </tbody>
          </table>
        </div>

        <button 
          className='flex justify-center items-center gap-4 py-1 m-4 mb-2 text-xs rounded-xl shadow-sm bg-amtblue/10'
          onClick={() => setDropdown(!dropdown)}
        >
          {dropdown ? <>Close Ticket Details <FaAnglesUp size={8} /></> : <>View Ticket Details <FaAnglesDown size={8} /></> }
        </button>
        
      </div>
      
      
    </div>
  )
}

export default Card