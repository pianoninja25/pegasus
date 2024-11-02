'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';

const Header = () => {

  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  useOnClickOutside(menuRef, () => setOpen(false));

  function useOnClickOutside(menuRef, handler) {
    useEffect(() => {
      const listener = (e) => {
        if (!menuRef.current || menuRef.current.contains(e.target)) {
          return;
        }
        handler(e);
      };
      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);
      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    }, [menuRef, handler]);
  }



  return (
    <div className='topbar fixed flex justify-between items-center w-screen h-14'>
      
      {/* LOGO */}
      <Link href="/" className='flex gap-1 items-center w-full p-2 z-20 text-2xl'>
        <div className='w-[12vw] xs:w-[2em] rounded-full sm:mx-16 sm:bg-black sm:border-4 sm:border-slate-400'>
          <Image className="w-auto h-auto p-[.4em] drop-shadow-md hover:scale-110" src="/unifiber-logo.svg" alt="logo" width={30} height={30} loading="lazy" />
        </div>
        <h1 className="text-nowrap text-[4.5vw] text-white xs:text-lg sm:hidden drop-shadow-sm">Dankom</h1>

      </Link>

      
      

      <div ref={menuRef}>
        {/* HAMBURGER */}
        <button onClick={() => setOpen(!open)} 
        className="absolute top-0 p-2 xs:p-3 right-2 z-50 sm:hidden scale-75 xs:scale-100"
        >
          <span className={`hamburger-line transition duration-300 ease-in-out origin-top-left ${open ? 'rotate-[40deg]' : ''}`}></span>
          <span className={`hamburger-line transition duration-300 ease-in-out ${open ? 'scale-0' : ''}`}></span>
          <span className={`hamburger-line transition duration-300 ease-in-out origin-bottom-left ${open ? '-rotate-[40deg]' : ''}`}></span>

        </button>



        {/* TEXT */}
        <nav
          className={`absolute top-14 right-4 py-2 flex-col w-full max-w-40 rounded-md shadow-md bg-white/70 backdrop-blur-sm 
          sm:flex-row sm:max-w-xs sm:justify-center sm:left-24 sm:p-0 sm:rounded-full sm:border-4 sm:border-slate-400 
          lg:top-14   
          ${open ? 'flex' : 'hidden sm:flex'}`}
        >
          {[
            ['Home', '/'],
            ['Ticket', '/ticket'],
            ['Workorder', '/workorder'],
            ['Mass Outage', '/massoutage'],
          ].map(([title, url]) => (
            <a
              key={title}
              href={url}
              className={`text-md px-4 p-1 rounded-md text-black font-lobster ${title=='Home' ? ' sm:hidden' :''} hover:text-orange hover:scale-110 lg:text-xl`}
            >
              { title }
            </a>
          ))}
        </nav>
      </div>
      
    </div>
  )
}

export default Header