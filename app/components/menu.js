import { PiMapPinAreaFill } from "react-icons/pi";
import { FaUserPlus, FaUserCheck, FaHourglassHalf } from "react-icons/fa"
import { IoTicket } from "react-icons/io5";
import { PiSirenFill } from "react-icons/pi";

const Menu = () => {
  return (
    <div className="flex items-center w-full h-14 px-2 text-center text-slate-200 bg-black">
      <span className="grid place-items-center gap-0.5 pt-1 w-1/4">
        <PiMapPinAreaFill size={25} color="#94a3b8" />
        <p className="text-sm">Coverage</p>
      </span>
      <span className="w-[.5px] h-10 bg-slate-400" />
      <span className="grid place-items-center gap-0.5 pt-1 w-1/4">
        <FaUserPlus size={25} color="#94a3b8" />
        <p className="text-sm">Installation</p>
      </span>
      <span className="w-[.5px] h-10 bg-slate-400" />
      <span className="grid place-items-center gap-0.5 pt-1 w-1/4">
        <IoTicket size={25} color="#94a3b8" />
        <p className="text-sm">Ticketing</p>
      </span>
      <span className="w-[.5px] h-10 bg-slate-400" />
      <span className="grid place-items-center gap-0.5 pt-1 w-1/4">
        <PiSirenFill size={25} color="#94a3b8" />
        <p className="text-sm">Outage</p>
      </span>
    </div>

  )
}

export default Menu