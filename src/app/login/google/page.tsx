"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export const GoogleLogin = () => {
  const data = useSession();
  useEffect(() => {
    if (data.status === "loading") return;
    if (data.status === "authenticated") return window.close();
    signIn("google");
  }, [data.status]);

  return <></>;
};

export default GoogleLogin;
