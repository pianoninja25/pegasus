'use client'

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { IoLogOut } from 'react-icons/io5';

const Header = ({ user }) => {
  const pathname = usePathname()


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
    <div className='fixed flex justify-between items-center w-screen h-14 sm:h-12 shadow-md bg-amtblue z-[999]'>
      
      {/* LOGO */}
      <Link href="/" className='flex gap-2 sm:gap-1 items-center h-fit text-2xl z-20'>
        <div className='w-10 sm:w-14 ml-4 rounded-full'>
          <Image className="w-auto h-auto p-1.5 sm:p-4 drop-shadow-md hover:scale-110" src="/unifiber-logo.svg" alt="logo" priority width={20} height={20} />
        </div>
        <h1 className="text-nowrap text-base sm:text-sm text-white drop-shadow-sm">{user}</h1>

      </Link>

      
      

      <div ref={menuRef}>
        {/* HAMBURGER */}
        <button onClick={() => setOpen(!open)} 
        className={`absolute top-0 p-2 right-2 z-50 sm:hidden ${open ? 'scale-50' : 'scale-75'}`}
        >
          <span className={`hamburger-line transition duration-300 ease-in-out origin-top-left ${open ? 'rotate-[40deg]' : ''}`}></span>
          <span className={`hamburger-line transition duration-300 ease-in-out ${open ? 'scale-0' : ''}`}></span>
          <span className={`hamburger-line transition duration-300 ease-in-out origin-bottom-left ${open ? '-rotate-[40deg]' : ''}`}></span>

        </button>



        {/* TEXT */}
        <nav
          className={`absolute top-1 right-4 flex-col sm:items-center gap-1 w-full max-w-40 h-fit pt-6 pb-6 rounded-md shadow-md backdrop-blur-md bg-gradient-to-b from-white/75 to-white/5 
          sm:flex-row sm:justify-center sm:right-32 sm:pt-1 sm:shadow-none sm:backdrop-blur-0 sm:bg-none
          ${open ? 'flex' : 'hidden sm:flex mr-10'}`}
        >
          {[
            ['Coverage', '/main/coverage'],
            ['Workorder', '/main/workorder'],
            ['Ticketing', '/main/ticketing'],
            ['Outage', '/main/massoutage'],
          ].map(([title, url]) => (
            <Link
              key={title}
              href={url}
              className={`text-xs px-6 sm:px-4 p-1 font-quicksand font-semibold rounded-md drop-shadow-md text-amtblue sm:text-slate-200 hover:text-amtorange transition-all duration-500 hover:shadow-lg hover:scale-110 
                ${url==pathname ? '!text-amtorange !font-bold' :''}`
              }
            >
              { title }
            </Link>
          ))}

          <button 
            onClick={() => signOut()} 
            className='flex items-center justify-around gap-2 w-fit h-fit px-6 py-1.5 text-xs font-semibold drop-shadow-md text-amtblue sm:text-slate-200 hover:text-amtorange transition-all duration-500 hover:shadow-lg hover:scale-110'
          >
            Logout 
            <IoLogOut size={18} />
          </button>
        </nav>
      </div>
      
    </div>
  )
}

export default Header