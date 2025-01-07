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

const WorkOrder = () => {
  const session = useSessionContext()

  const [isDesktop, setIsDesktop] = useState(false)
  const mediaQuery = useMediaQuery({ query: '(min-width: 640px)' })
  useEffect(() => {
    setIsDesktop(mediaQuery)
  }, [mediaQuery])

  
  const [datas, setDatas] = useState([])
  // const datas = [
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
    const fetchTokenAndData = async () => {
      if (!session?.user?.name) {
        console.warn("User name is undefined, skipping fetch.");
        return;
      }
  
      try {
        setLoading(true)
        const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:8002/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: session?.user?.name,
            password: "test",
          }),
        });
  
        if (!tokenResponse.ok) {
          throw new Error(`Failed to fetch token. Status: ${tokenResponse.status}`);
        }
  
        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;
  
        if (!token) {
          throw new Error("Token is missing in the response");
        }
  
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}:8002/orders?client_name=${encodeURIComponent(session.user.name)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setDatas(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false)
      }
    };
  
    
    if (session?.user?.name) {
      fetchTokenAndData();
    }
  }, [session?.user?.name]);


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

  return (
    <div className='min-h-screen pt-20 bg-slate-100 pb-20'>
      {!isDesktop && datas.length>=0 && (
        <div className='sm:hidden'>
          {!session || loading || !filteredData
            ? <div className='loading' />
            :
              <>
              <Filter {...{ handleSearchChange, statusFilter, setStatusFilter, statusCounts }} />
                {filteredData?.map((a, idx) => (
                  <Card key={idx} datas={a} />
                ))}
                {filteredData.length<1 && <p className='text-center p-12'>No data.</p>}  
              </>
          }
        </div>
      )}

      {/* {isDesktop && <div className='relative min-h-80 m-10 mt-2 mb-4 p-8 pb-0 shadow-sm rounded-xl bg-white'>
        <div className={!session || loading ? 'loading' : ''} />
        {!loading && <Tables datas={datas} />}
      </div>} */}


      {isDesktop && (
        <div className='relative min-h-80 m-10 mt-0 mb-4 p-8 pt-6 pb-0 shadow-sm rounded-xl bg-white'>
          {!session || loading || !filteredData
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


