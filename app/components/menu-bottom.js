
'use client'
import { useRouter } from "next/navigation";

import { PiMapPinAreaFill } from "react-icons/pi";
import { FaUserPlus, FaUserCheck, FaHourglassHalf } from "react-icons/fa"
import { IoTicket } from "react-icons/io5";
import { PiSirenFill } from "react-icons/pi";

const MenuBottom = () => {

  const router = useRouter();
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex items-center w-full h-14 px-2 text-center text-slate-200 bg-black">
      <button className="grid place-items-center gap-1 pt-0.5 w-1/4" onClick={() => handleNavigation('/main/coverage')}>
        <PiMapPinAreaFill size={22} color="#94a3b8" />
        <p className="text-xs">Coverage</p>
      </button>
      <span className="w-[.5px] h-10 bg-slate-400" />
      <button className="grid place-items-center gap-1 pt-0.5 w-1/4" onClick={() => handleNavigation('/main/workorder')}>
        <FaUserPlus size={22} color="#94a3b8" />
        <p className="text-xs">Installation</p>
      </button>
      <span className="w-[.5px] h-10 bg-slate-400" />
      <button className="grid place-items-center gap-1 pt-0.5 w-1/4" onClick={() => handleNavigation('/main/ticketing')}>
        <IoTicket size={22} color="#94a3b8" />
        <p className="text-xs">Ticketing</p>
      </button>
      <span className="w-[.5px] h-10 bg-slate-400" />
      <button className="grid place-items-center gap-1 pt-0.5 w-1/4" onClick={() => handleNavigation('/main/massoutage')}>
        <PiSirenFill size={22} color="#94a3b8" />
        <p className="text-xs">Outage</p>
      </button>
    </div>

  )
}

export default MenuBottom