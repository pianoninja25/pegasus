'use client'
import AuthProvider from '../context/auth-provider'
import Header from '../components/header';
import MenuBottom from '../components/menu-bottom'

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import "../globals.css"




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
    <html lang="en">
      <body className="antialiased font-quicksand">
        <AuthProvider>
          <Header user={session?.user.name} />
            {children}
          <footer className='fixed bottom-0 w-full z-[999] sm:hidden'>
            <MenuBottom />

            {/* MASS OUTAGE - Need to put here, so the notif is appear on other page! */}
            {/* <div className='absolute bottom-10 right-4 flex justify-center items-center w-6 h-6 p-1 rounded-full text-white bg-amtred animate-bounce'>
              <span className='text-xs font-bold'>{datas}</span>
            </div> */}
          </footer>
        </AuthProvider>

      </body>
    </html>
  )
}
