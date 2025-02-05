'use client'

import { useEffect, useState } from 'react'
import Card from './component/card'
import Tables from './component/table'
import { useMediaQuery } from 'react-responsive'
import Filter from './component/filter'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { FaDownload } from 'react-icons/fa'
import { useSessionContext } from "@/app/context/session-provider";
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useUser } from '@/app/context/useUser'
import { isTokenExpired, refreshAccessToken } from '@/app/service/token'

const WorkOrder = () => {
  // const {session} = useSessionContext()
  // const { data: session, status } = useSession();
  const { user: session, loadingSession, isAuthenticated } = useUser();
  
  

  const [isDesktop, setIsDesktop] = useState(false)
  const mediaQuery = useMediaQuery({ query: '(min-width: 640px)' })
  useEffect(() => {
    setIsDesktop(mediaQuery)
  }, [mediaQuery])

  
  const [datas, setDatas] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  


  async function getData() {
    try {
      setLoading(true)
      if (session && isTokenExpired(session?.access_token)) {
        await refreshAccessToken();
      }
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PEGASUS_API}/orders?auth_id=${session?.auth_id}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching:', error);
      throw error;
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if(session?.name) {
          const fetchedData = await getData();
          setDatas(fetchedData);
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    fetchData();
  }, [session?.name]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  const statusCounts = datas?.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      acc['All'] += 1;
      return acc;
    },
    { All: 0 }
  );
  
  const filteredData = datas?.filter((i) => {
    const matchesSearch =
      i.order_number.toLowerCase().includes(searchValue.toLowerCase()) ||
      i.name.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });




  if (loadingSession) {
    return (
      <div className='loading' />
    )
  }


  return (
    <div className='min-h-screen pt-20 bg-slate-100 pb-10'>
      {!isDesktop && datas.length>=0 && (
        <div className='sm:hidden'>
          <>
            <Filter {...{ handleSearchChange, statusFilter, setStatusFilter, statusCounts }} />
            {filteredData?.map((a, idx) => (
              <Card key={idx} datas={a} />
            ))}
            {filteredData.length<1 && <p className='text-center p-12'>No data.</p>}  
          </>
        </div>
      )}

      {/* {isDesktop && <div className='relative min-h-80 m-10 mt-2 mb-4 p-8 pb-0 shadow-sm rounded-xl bg-white'>
        <div className={!session || loading ? 'loading' : ''} />
        {!loading && <Tables datas={datas} />}
      </div>} */}


      {isDesktop && (
        <div className='relative min-h-80 m-10 mt-0 mb-4 p-8 pt-6 pb-0 shadow-sm rounded-xl bg-white'>
          {loading 
            ? <div className='loading' />
            : 
            <>
              <Filter {...{ handleSearchChange, statusFilter, setStatusFilter, statusCounts }} />
              <CSVLink
                data={datas.map(({ detail, ...rest }) => rest)}
                filename={`Workorder - ${moment().format('YYYYMMDD HHmmss')}.csv`}
                className="absolute left-[20rem] top-6 flex items-center gap-2 px-4 py-1 text-xs rounded-full shadow-sm border border-white text-white bg-amtblue/20 hover:bg-amtblue z-[99]"
              >
                Download <FaDownload size={14} color="white"  className='pb-0.5'/>
              </CSVLink>
              <Tables datas={filteredData} />
              </>      
          }
        </div>
      )}
    </div>
  )
}

export default WorkOrder

