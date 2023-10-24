import { auth } from "@/server/auth";
import { PersonalTicketCard } from "./personal-ticket-card";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { api } from "@/trpc/server";

const TicketsContainer = async () => {
  const data = await api.tickets.myPersoanlTickets.query();

  return data.map((ticket) => (
    <PersonalTicketCard key={ticket.ticket_id} ticketData={ticket} />
  ));
};

const MyTicketsPage = async () => {
  const user = await auth();

  if (!user?.user)
    return (
      <div className="p-4">
        <h1>אנו מצטערים אך אין לך הרשאה לצפות בדף זה</h1>
        <span>אנא התחבר בשביל לצפות בדף זה</span>
      </div>
    );
  return (
    <div className="flex h-full flex-1 flex-col flex-wrap space-y-4  p-4 md:space-y-8 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            ברוך שובך למערכת חרבות ברזל!
          </h2>
          <p className="text-muted-foreground">להלן רשימת הפניות האישית שלך:</p>
        </div>
      </div>
      <div className="flex w-full flex-1 flex-wrap content-stretch items-stretch gap-4 space-x-2">
        <Suspense
          fallback={
            <Loader2 className="m-auto flex h-8 w-8 flex-1 animate-spin text-primary" />
          }
        >
          <TicketsContainer />
        </Suspense>
      </div>
    </div>
  );
};

export default MyTicketsPage;
