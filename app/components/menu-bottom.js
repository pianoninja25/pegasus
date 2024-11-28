
'use client'
import { usePathname, useRouter } from "next/navigation";

import { PiMapPinAreaFill } from "react-icons/pi";
import { LuCalendarCheck } from "react-icons/lu";
import { IoTicket } from "react-icons/io5";
import { PiSirenFill } from "react-icons/pi";

const MenuBottom = () => {
  const pathname = usePathname()

  const router = useRouter();
  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="flex items-center w-full h-14 px-2 text-center text-slate-400 bg-[#06132b]">
      <button 
        className={`grid place-items-center gap-0.5 w-1/4 ${pathname.includes('coverage') ? 'text-white' : ''}`}
        onClick={() => handleNavigation('/main/coverage')}
      >
        <PiMapPinAreaFill size={22} />
        <p className="text-xs">Coverage</p>
      </button>

      <span className="w-[.5px] h-10 bg-slate-400" />

      <button 
        className={`grid place-items-center gap-0.5 w-1/4 ${pathname.includes('workorder') ? 'text-white' : ''}`}
        onClick={() => handleNavigation('/main/workorder')}
      >
        <LuCalendarCheck size={22} />
        <p className="text-xs">Workorder</p>
      </button>

      <span className="w-[.5px] h-10 bg-slate-400" />
      
      <button 
        className={`grid place-items-center gap-0.5 w-1/4 ${pathname.includes('ticketing') ? 'text-white ' : ''}`}
        onClick={() => handleNavigation('/main/ticketing')}
      >
        <IoTicket size={22} />
        <p className="text-xs">Ticketing</p>
      </button>

      <span className="w-[.5px] h-10 bg-slate-400" />

      <button 
        className={`grid place-items-center gap-0.5 w-1/4 ${pathname.includes('massoutage') ? 'text-white' : ''}`}
        onClick={() => handleNavigation('/main/massoutage')}
      >
        <PiSirenFill size={22} />
        <p className="text-xs">Outage</p>
      </button>
    </div>

  )
}

export default MenuBottom