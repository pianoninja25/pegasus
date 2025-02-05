'use client'

import { useUser } from "@/app/context/useUser";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUserManagement } from "./function";
import UserManagement from "./page-management";

const Home = () => {
  const { user: session, loadingSession, isAuthenticated } = useUser();
  const router = useRouter();

  const [datas, setDatas] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(session?.role === 'superadmin' ? 'tenant' : 'user');


  
  useEffect(() => {
    fetchUserManagement(session, setDatas, setLoadingData);
  }, [refresh, session?.username]);


  if (loadingSession || loadingData) {
    return <div className="loading" />;
  }

  if (!isAuthenticated) {
    router.push("/auth/signin");
    return null;
  }

  if (session?.role === "superadmin" || session?.role === "admin") {
    return (
      <UserManagement {...{session, datas, refresh, setRefresh, currentPage, setCurrentPage}}/>
    )
  }
  
  return <div className="pt-20">User Profile</div>;
};

export default Home;
