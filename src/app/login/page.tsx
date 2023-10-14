import { Button } from "@/components/ui/button";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import SocialLoginButtons from "./login-buttons";

const LoginPage = async () => {
  const { session } = await api.user.whoami.query();
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
