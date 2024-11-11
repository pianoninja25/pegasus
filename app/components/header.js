'use client'

import { signOut } from 'next-auth/react';
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react';
import { IoLogOut } from 'react-icons/io5';

const Header = ({ user }) => {

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
    <div className='fixed flex justify-between items-center w-screen h-14 bg-amtblue z-[999]'>
      
      {/* LOGO */}
      <Link href="/" className='flex gap-1 items-center h-fit text-2xl z-20'>
        <div className='w-12 sm:w-14 rounded-full'>
          <Image className="w-auto h-auto p-[.4em] drop-shadow-md hover:scale-110" src="/unifiber-logo.svg" alt="logo" width={30} height={30} loading="lazy" />
        </div>
        <h1 className="text-nowrap text-sm sm:text-base text-white drop-shadow-sm">{user}</h1>

      </Link>

      
      

      <div ref={menuRef}>
        {/* HAMBURGER */}
        <button onClick={() => setOpen(!open)} 
        className={`absolute top-0 p-2 right-2 z-50 scale-75 sm:hidden`}
        >
          <span className={`hamburger-line transition duration-300 ease-in-out origin-top-left ${open ? 'rotate-[40deg]' : ''}`}></span>
          <span className={`hamburger-line transition duration-300 ease-in-out ${open ? 'scale-0' : ''}`}></span>
          <span className={`hamburger-line transition duration-300 ease-in-out origin-bottom-left ${open ? '-rotate-[40deg]' : ''}`}></span>

        </button>



        {/* TEXT */}
        <nav
          className={`absolute top-2 right-4 flex-col sm:items-center gap-1.5 w-full max-w-40 h-fit pt-8 pb-4 rounded-md shadow-md backdrop-blur-md bg-white/80 
          sm:flex-row sm:justify-center sm:right-40 sm:pt-1 sm:shadow-none sm:backdrop-blur-0 sm:bg-transparent
          ${open ? 'flex' : 'hidden sm:flex mr-10'}`}
        >
          {[
            ['Coverage', '/'],
            ['Workorder', '/workorder'],
            ['Ticketing', '/ticket'],
            ['Outage', '/massoutage'],
          ].map(([title, url]) => (
            <a
              key={title}
              href={url}
              className={`px-4 py-0.5 rounded-md sm:text-white hover:text-orange hover:scale-110`}
            >
              { title }
            </a>
          ))}

          <button 
            onClick={() => signOut()} 
            className='flex items-center justify-around gap-2 w-fit h-fit px-4 py-1 font-bold text-amtorange hover:scale-110'
          >
            Logout 
            <IoLogOut size={20} />
          </button>
        </nav>
      </div>
      
    </div>
  )
}

export default Header