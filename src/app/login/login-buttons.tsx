"use client";

import { Button } from "@/components/ui/button";
import type React from "react";
import { signIn, signOut } from "next-auth/react";

import { SiGoogle, SiFacebook } from "react-icons/si";
const SocialLoginButtons: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* <Button
        onClick={() => {
          void signIn("facebook");
        }}
        className="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
      >
        <SiFacebook className="mr-2" />
        Sign in with Facebook
      </Button> */}
      <Button
        onClick={() => {
          void signIn("google");
        }}
        className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <SiGoogle className="me-2" />
        התחבר עם גוגל
      </Button>
    </div>
  );
};

export default SocialLoginButtons;
