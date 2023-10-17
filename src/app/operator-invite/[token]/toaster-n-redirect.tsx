"use client";

import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ToasterNRedirect: React.FC<{
  msg: string;
  href: string;
  success: boolean;
}> = ({ msg, href, success }) => {
  const router = useRouter();
  const d = useSession();
  useEffect(() => {
    d.update();
    toast({
      title: msg,
      variant: success ? "success" : "destructive",
    });
    router.replace(href);
  }, []);

  return <></>;
};

export default ToasterNRedirect;
