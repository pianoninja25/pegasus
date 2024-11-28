'use client'

import { useEffect, useState } from 'react'
import Card from './component/card'
import Tables from './component/table'
import { useSession } from 'next-auth/react'
import { useMediaQuery } from 'react-responsive'
import Filter from './component/filter'

const WorkOrder = () => {
  const { data: session, status} = useSession()

  const [isDesktop, setIsDesktop] = useState(false)
  const mediaQuery = useMediaQuery({
    query: '(min-width: 640px)'
  })
  useEffect(() => {
    setIsDesktop(mediaQuery)
  }, [mediaQuery])

  
  const [datas, setDatas] = useState([])
  // const datas = [
  const [loading, setLoading] = useState(false)
  //   {
  //   "order_number": "OH1099455654756737873",
  //   "order_created_date": "2024-11-03T11:20:54",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTEB",
  //   "order_scheduled_date": "2024-11-04 14:30:15",
  //   "order_completed_date": null,
  //   "homepass_id": 5189560122,
  //   "sitename": "PEMUKIMAN RW10 PEJUANG",
  //   "name": "Muhamad Linda",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "MEDANSATRIA",
  //   "subDistrict": "PEJUANG",
  //   "locality": "PEJUANG",
  //   "address": "Kaliabang Dukuh RT/RW 01/10 No 52",
  //   "status": "Progress",
  //   "color": "text-orange-700 bg-orange-100"
  //   },
  //   {
  //   "order_number": "OH1099558487427753422",
  //   "order_created_date": "2024-11-04T15:54:47",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-05 09:30:15",
  //   "order_completed_date": "2024-11-06 16:31:19",
  //   "homepass_id": 5171512666,
  //   "sitename": "PERUMAHAN TAMAN CENDRAWASIH RW45",
  //   "name": "Hendri susanto",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "BABELAN",
  //   "subDistrict": "BAHAGIA",
  //   "locality": "BABELAN",
  //   "address": "Taman Cendrawasih blok C15/3A",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1099559504802562282",
  //   "order_created_date": "2024-11-04T16:11:44",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-05 09:30:15",
  //   "order_completed_date": "2024-11-26 18:27:33",
  //   "homepass_id": 5189559956,
  //   "sitename": "PEMUKIMAN RW10 PEJUANG",
  //   "name": "Ervi Riyanti",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "MEDANSATRIA",
  //   "subDistrict": "PEJUANG",
  //   "locality": "MEDANSATRIA",
  //   "address": "Kaliabang  Dukuh",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1099713235662028644",
  //   "order_created_date": "2024-11-06T10:53:55",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-07 09:30:15",
  //   "order_completed_date": "2024-11-20 10:48:56",
  //   "homepass_id": 5171546766,
  //   "sitename": "PUP SEKTOR 5 RW 26",
  //   "name": "Hanif Izzul Haq",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "BABELAN",
  //   "subDistrict": "BAHAGIA",
  //   "locality": "BABELAN",
  //   "address": "Pondok Ungu Permai Sektor V blok k2",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1099713527212361415",
  //   "order_created_date": "2024-11-06T10:58:47",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-07 09:30:15",
  //   "order_completed_date": "2024-11-20 10:38:17",
  //   "homepass_id": 5171549605,
  //   "sitename": "TAMAN KEBALEN RW 19",
  //   "name": "Sefty Wilda Yanti",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "BABELAN",
  //   "subDistrict": "KEBALEN",
  //   "locality": "BABELAN",
  //   "address": "jl. H. Muji No.310 RT/RW",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1099822581835953694",
  //   "order_created_date": "2024-11-07T17:16:21",
  //   "order_type": "installationOrder",
  //   "order_status": "SCHED",
  //   "order_scheduled_date": "2024-11-09 09:30:15",
  //   "order_completed_date": null,
  //   "homepass_id": 5189525188,
  //   "sitename": "MUSTIKA JAYA RW 07",
  //   "name": "Mega Warni",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "MUSTIKAJAYA",
  //   "subDistrict": "MUSTIKAJAYA",
  //   "locality": "MUSTIKAJAYA",
  //   "address": "Jl Bayan 1 no 41",
  //   "status": "Progress",
  //   "color": "text-orange-700 bg-orange-100"
  //   },
  //   {
  //   "order_number": "OH1100225685525074778",
  //   "order_created_date": "2024-11-12T09:14:45",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-13 14:30:15",
  //   "order_completed_date": "2024-11-20 10:58:51",
  //   "homepass_id": 5189511981,
  //   "sitename": "PONDOK UNGU PERMAI RW09",
  //   "name": "Frida Mustamu",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "BEKASI UTARA",
  //   "subDistrict": "KALIABANG TENGAH",
  //   "locality": "KALIABANG TENGAH",
  //   "address": "PUP BLOK AB 3 no 14 RT/RW:002/009",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100256828988432105",
  //   "order_created_date": "2024-11-12T17:53:48",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-13 14:30:15",
  //   "order_completed_date": "2024-11-20 10:54:10",
  //   "homepass_id": 5189525541,
  //   "sitename": "MUSTIKA JAYA RW 07",
  //   "name": "Andi Kuswanto",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "MUSTIKAJAYA",
  //   "subDistrict": "MUSTIKAJAYA",
  //   "locality": "MUSTIKAJAYA",
  //   "address": "Kp Ciketing no 85 RT/RW 004/007",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100316535430097723",
  //   "order_created_date": "2024-11-13T10:28:55",
  //   "order_type": "installationOrder",
  //   "order_status": "SCHED",
  //   "order_scheduled_date": "2024-11-14 14:30:15",
  //   "order_completed_date": null,
  //   "homepass_id": 5171508662,
  //   "sitename": "CLUSTER BUMI NIRWANA",
  //   "name": "Fika Fitriani",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "TAMBUN SELATAN",
  //   "subDistrict": "MANGUNJAYA",
  //   "locality": "MANGUNJAYA",
  //   "address": "Cluster Intan Deva Residence Blok C No 2",
  //   "status": "Progress",
  //   "color": "text-orange-700 bg-orange-100"
  //   },
  //   {
  //   "order_number": "OH1100319175004375026",
  //   "order_created_date": "2024-11-13T11:12:55",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-14 14:30:15",
  //   "order_completed_date": "2024-11-20 11:12:59",
  //   "homepass_id": 5189515444,
  //   "sitename": "PERUMAHAN PEJUANG JAYA RW04",
  //   "name": "Dedi Firdaus",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "MEDANSATRIA",
  //   "subDistrict": "PEJUANG",
  //   "locality": "PEJUANG",
  //   "address": "Kaliabang Bahagia RT/RW:02/04",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100484214968928125",
  //   "order_created_date": "2024-11-15T09:03:34",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-16 14:30:15",
  //   "order_completed_date": "2024-11-20 11:08:43",
  //   "homepass_id": 5189511671,
  //   "sitename": "PONDOK UNGU PERMAI RW13 KALIABANG TENGAH",
  //   "name": "Faizal Herman",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "BEKASI UTARA",
  //   "subDistrict": "KALIABANG TENGAH",
  //   "locality": "KALIABANG TENGAH",
  //   "address": "Pondok Ungu Permai Blok C20 no 4",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100510307743013452",
  //   "order_created_date": "2024-11-15T16:18:27",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-16 14:30:15",
  //   "order_completed_date": "2024-11-17 17:45:09",
  //   "homepass_id": 5171500128,
  //   "sitename": "LETICIA REGENCY",
  //   "name": "Muhammad Arliadi",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "TAMBUN SELATAN",
  //   "subDistrict": "MANGUNJAYA",
  //   "locality": "MANGUNJAYA",
  //   "address": "Kavling Arta Buana No 5 RT/RW 003 /006",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100597905126891824",
  //   "order_created_date": "2024-11-16T16:38:25",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-17 14:30:15",
  //   "order_completed_date": "2024-11-20 09:58:57",
  //   "homepass_id": 5171511024,
  //   "sitename": "PONDOK UNGU PERMAI RW12",
  //   "name": "Hadijah",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "BABELAN",
  //   "subDistrict": "BAHAGIA",
  //   "locality": "BAHAGIA",
  //   "address": "Pondok Ungu Permai Blok AN 13 No 14 RT/RW 10/11",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100750454074035796",
  //   "order_created_date": "2024-11-18T11:00:54",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-19 09:30:15",
  //   "order_completed_date": "2024-11-20 10:15:27",
  //   "homepass_id": 5189558401,
  //   "sitename": "PERUMAHAN TAMAN HARAPAN BARU RW 22",
  //   "name": "Fabio Hafizh Kamil",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KOTA BEKASI",
  //   "district": "MEDANSATRIA",
  //   "subDistrict": "PEJUANG",
  //   "locality": "PEJUANG",
  //   "address": "aman harapan baru Blok D6 no 7 RT/RW 03/22",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1100916576992476488",
  //   "order_created_date": "2024-11-20T09:09:36",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTEB",
  //   "order_scheduled_date": "2024-11-20 14:30:15",
  //   "order_completed_date": null,
  //   "homepass_id": 5171543254,
  //   "sitename": "GRAHA HARAPAN REGENCY BABELAN KOTA",
  //   "name": "Romauli Hotma Butar - Butar",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "BABELAN",
  //   "subDistrict": "BABELANKOTA",
  //   "locality": "BABELANKOTA",
  //   "address": "Perum Graha Harapan Regency Blok H10 No 1 RT/RW:006/0014",
  //   "status": "Progress",
  //   "color": "text-orange-700 bg-orange-100"
  //   },
  //   {
  //   "order_number": "OH1101207255356778184",
  //   "order_created_date": "2024-11-23T17:54:15",
  //   "order_type": "installationOrder",
  //   "order_status": "COMPTE",
  //   "order_scheduled_date": "2024-11-24 14:30:15",
  //   "order_completed_date": "2024-11-25 10:46:08",
  //   "homepass_id": 5171519127,
  //   "sitename": "PERUMAHAN EDELWEIS TAMBUN UTARA",
  //   "name": "Marselindafitri",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "TAMBUN UTARA",
  //   "subDistrict": "SATRIAJAYA",
  //   "locality": "SATRIAJAYA",
  //   "address": "Satria Mekar Jaya Residence No 29. Jl pistol 2",
  //   "status": "Complete",
  //   "color": "text-green-700 bg-green-100"
  //   },
  //   {
  //   "order_number": "OH1101453411545944289",
  //   "order_created_date": "2024-11-26T14:16:51",
  //   "order_type": "installationOrder",
  //   "order_status": "SCHED",
  //   "order_scheduled_date": "2024-11-27 14:30:15",
  //   "order_completed_date": null,
  //   "homepass_id": 5171046908,
  //   "sitename": "KARANGSATRIA RW 04 BEKASI",
  //   "name": "Muhammad Ghazale Afrizal",
  //   "stateOrProvince": "JAWA BARAT",
  //   "city": "KAB. BEKASI",
  //   "district": "TAMBUN UTARA",
  //   "subDistrict": "KARANGSATRIA",
  //   "locality": "KARANGSATRIA",
  //   "address": "Jl Al Inayah Karang Ampel RT/RW:01/04",
  //   "status": "Progress",
  //   "color": "text-orange-700 bg-orange-100"
  //   }
  //   ]

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!session?.user?.name) {
  //       console.warn("User name is undefined, skipping fetch.");
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const response = await fetch(
  //         `http://127.0.0.1:8000/orders?client_name=${encodeURIComponent(session.user.name)}`
  //       );
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       console.log(data);
  //       setDatas(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Trigger fetchData only when session.user.name exists
  //   if (session?.user?.name) {
  //     fetchData();
  //   }
  // }, [session?.user?.name]);






  // const [filterTable, setFilterTable] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.name) {
        console.warn("User name is undefined, skipping fetch.");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8002/orders?client_name=${encodeURIComponent(session.user.name)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDatas(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.name) {
      fetchData();
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
          <div className={!session || loading ? 'loading' : ''} />
          <Filter {...{ handleSearchChange, statusFilter, setStatusFilter, statusCounts }} />
          {filteredData?.map((a, idx) => (
            <Card key={idx} datas={a} />
          ))}
          {filteredData.length<1 && <p className='text-center p-12'>No data.</p>}
        </div>
      )}

      {isDesktop && <div className='relative min-h-80 m-10 mt-2 mb-4 p-8 pb-0 shadow-sm rounded-xl bg-white'>
        <div className={!session || loading ? 'loading' : ''} />
        {!loading && <Tables datas={datas} />}
      </div>}
    </div>
  )
}

export default WorkOrder