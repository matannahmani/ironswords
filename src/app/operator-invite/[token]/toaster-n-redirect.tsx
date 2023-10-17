"use client";

import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ToasterNRedirect: React.FC<{
  msg: string;
  href: string;
  success: boolean;
}> = ({ msg, href, success }) => {
  const router = useRouter();
  useEffect(() => {
    toast({
      title: msg,
      variant: success ? "success" : "destructive",
    });
    router.replace(href);
  }, []);

  return <></>;
};

export default ToasterNRedirect;
