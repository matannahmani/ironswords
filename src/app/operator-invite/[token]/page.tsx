import SocialLoginButtons from "@/app/login/login-buttons";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import ToasterNRedirect from "./toaster-n-redirect";
import { decodeInvite } from "@/shared/utils/invite-encoder";

export default async function ClaimInvitePage({
  searchParams,
  params,
}: {
  searchParams: Record<string, string | string[] | undefined>;
  params: {
    token: string;
  };
}) {
  const isLogged = await auth();
  const { invite_id, expires } = decodeInvite(params.token);
  try {
    if (isLogged) {
      const result = await api.operatorInvites.claimInvite.mutate({
        invite_id: invite_id,
        expires: expires.toString(),
      });
      return (
        <ToasterNRedirect
          msg="הזמנה התקבלה בהצלחה"
          href="/operators/all"
          success={true}
        />
      );
    } else {
      const inviteData = await api.operatorInvites.findInvite.query({
        invite_id: invite_id,
        expires: expires.toString(),
      });
      return (
        <div className="flex h-screen flex-col items-center  gap-4 py-4">
          <span className="text-2xl font-bold">כדי להמשיך עליך להתחבר</span>
          <SocialLoginButtons />
        </div>
      );
    }
  } catch (err) {}
  return <ToasterNRedirect href="/" msg="הזמנה לא תקינה" success={false} />;
}
