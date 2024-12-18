'use client'
import Header from '../components/header';
import MenuBottom from '../components/menu-bottom'

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import "../globals.css"
import { SessionProvider } from '../context/session-provider';




export default function RootLayout({ children }) {
  const { data: session, status} = useSession()
  
  // const [datas, setDatas] = useState()


  // useEffect(() => {
  //   const fetchTokenAndData = async () => {
  //     if (!session?.user?.name) {
  //       console.warn("User name is undefined, skipping fetch.");
  //       return;
  //     }
  
  //     try {
  //       // Step 1: Fetch the token
  //       const tokenResponse = await fetch("http://127.0.0.1:8002/token", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           // username: session?.user?.name,
  //           username: "CX IOH",
  //           password: "ioh456#",
  //         }),
  //       });
  
  //       if (!tokenResponse.ok) {
  //         throw new Error(`Failed to fetch token. Status: ${tokenResponse.status}`);
  //       }
  
  //       const tokenData = await tokenResponse.json();
  //       const token = tokenData.access_token;
  
  //       if (!token) {
  //         throw new Error("Token is missing in the response");
  //       }
  
  //       const response = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}:8002/massoutages?client_name=${encodeURIComponent(session.user.name)}`,
  //         {
  //           method: "GET",
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  
  //       const data = await response.json();
  //       setDatas(data.total);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };
  
    
  //   if (session?.user?.name) {
  //     fetchTokenAndData();
  //   }
  // }, [session?.user?.name]);

  
  return (
    // <>
    //   <Header user={session?.user.name} />
    //     {childrenWithProps}
    //   <footer className='fixed bottom-0 w-full z-[999] sm:hidden'>
    //     <MenuBottom />
    //   </footer>
    // </>
    <SessionProvider session={session}>
      <Header user={session?.user?.name} />
      {children}
      <footer className="fixed bottom-0 w-full z-[999] sm:hidden">
        <MenuBottom />
      </footer>
    </SessionProvider>
  )
}
