import { useSession } from "next-auth/react";

export const useUser = () => {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user,
    loadingSession: status === "loading",
    isAuthenticated: status === "authenticated",
  };
};