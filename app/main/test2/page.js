"use client";

import { useSessionContext } from "@/app/context/session-provider";


const Test = () => {
  const session = useSessionContext();

  return (
    <div className="pt-20">
      <h1>Welcome, {session?.user?.name || "Guest"}!</h1>
      <p>Email: {session?.user?.email}</p>
    </div>
  );
};

export default Test;
