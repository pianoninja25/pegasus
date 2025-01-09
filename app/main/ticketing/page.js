'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useMediaQuery } from 'react-responsive'
import { CSVLink } from 'react-csv'
import { FaDownload } from 'react-icons/fa'
import moment from 'moment'
import FormTicket from './components/form'
import Filter from './components/filter'
import Card from './components/card'
import Tables from './components/table'
import axios from 'axios'

const Ticketing = () => {
  const { data: session, status} = useSession()

  const [isDesktop, setIsDesktop] = useState(false)
  const mediaQuery = useMediaQuery({
    query: '(min-width: 640px)'
  })
  useEffect(() => {
    setIsDesktop(mediaQuery)
  }, [mediaQuery])

  
  const [datas, setDatas] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState([])


  async function getData() {
    try {
      setLoading(true)
      const response = await axios.post('/api/wo_ticket_list', {
        username: session?.user?.name,
        password: 'test',
        type: 'tickets'
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching token:', error);
      throw error;
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (!session?.user?.name) return;
  
    const fetchData = async () => {
      try {
        const fetchedData = await getData();
        setDatas(fetchedData);
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };
  
    fetchData();
  }, [session?.user?.name, refresh]);


  
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
  const statusCounts = datas?.reduce(
    (acc, item) => {
      acc[item.ticket_status] = (acc[item.ticket_status] || 0) + 1;
      acc['All'] += 1;
      return acc;
    },
    { All: 0 }
  );
  const filteredData = datas?.filter((i) => {
    const matchesSearch =
      i.customer_id.toLowerCase().includes(searchValue.toLowerCase()) || 
      i.amt_ticket_id.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || i.ticket_status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  if (status === 'loading') {
    return (
      <div className='loading' />
    )
  }

  return (
    <div className='min-h-screen pt-20 bg-slate-100 pb-20'>
      {!isDesktop && datas.length>=0 && (
        <div className='sm:hidden'>
          {!session || loading || filteredData.length<1
          ? <div className='loading' />
          : 
            <>
            <Filter {...{ handleSearchChange, statusFilter, setStatusFilter, statusCounts }} />
            <FormTicket user={session?.user?.name} {...{setRefresh, loading, setLoading, isDesktop}} />
            {filteredData?.map((a, idx) => (
              <Card key={idx} datas={a} />
            ))}
            {filteredData.length<1 && <p className='text-center p-12'>No data.</p>}
            </>
          }
        </div>
      )}

      {isDesktop && (
        <div className='relative min-h-80 m-10 mt-0 mb-4 p-8 pt-6 pb-0 shadow-sm rounded-xl bg-white'>
          {loading
          ? <div className='loading' />
            : 
            <>
              <FormTicket user={session?.user?.name} {...{setRefresh, loading, setLoading, isDesktop}} />
              <Filter {...{ handleSearchChange, statusFilter, setStatusFilter, statusCounts }} />
              <CSVLink 
                data={datas.map(({ detail, billing_ioh, smartcare_id, ...rest }) => rest)}
                filename={`Ticket - ${moment().format('YYYYMMDD HHmmss')}.csv`}
                className="absolute left-[19rem] top-6 flex items-center gap-2 px-4 py-1 text-xs rounded-full shadow-sm border border-white text-white bg-amtblue/20 hover:bg-amtblue z-[99]"
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

export default Ticketing