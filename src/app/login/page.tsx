import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import SocialLoginButtons from "./login-buttons";
import { auth } from "@/server/auth";

const LoginPage = async () => {
  const session = await auth();
  if (session) {
    redirect("/");
  }
  return (
    <div className="flex grow items-center justify-center gap-2">
      <SocialLoginButtons />
    </div>
  );
};

export default LoginPage;
