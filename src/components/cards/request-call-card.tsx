import {
  Bookmark,
  Calendar,
  ChevronDownIcon,
  CircleIcon,
  PencilRuler,
  Play,
  PlusIcon,
  Settings,
  Share,
  ShieldAlert,
  StarIcon,
} from "lucide-react";

import { Button, buttonVariants } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSelectItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Separator } from "@ui/separator";
import ClientWrapper from "../utils/client-wrapper";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { RequestShareCard } from "./request-share-card";
import { RequestTakeCard } from "./request-take-card";
import { tickets } from "@/server/db/schema";
import { ticketPriority } from "@/app/operators/tickets/data/data";
import { priotityToHE } from "@/shared/zod/base";
import { cn } from "@/lib/utils";
import { Suspense, lazy } from "react";
import { Skeleton } from "../ui/skeleton";
import dynamic from "next/dynamic";
// import RequestCallCardActions from "./request-call-card-actions";
const RequestCallCardActions = dynamic(
  () => import("./request-call-card-actions"),
  {
    ssr: false,
    loading() {
      return <Skeleton className="h-10 w-32" />;
    },
  },
);
export const RequestCallCard: React.FC<{
  title: string;
  description: string;
  id: string;
  urgency: typeof tickets.$inferSelect.priority;
  urgencyLabel: string;
  status: typeof tickets.$inferSelect.status;
  statusLabel: string;
  date: string;
}> = ({
  title,
  description,
  id,
  urgency,
  status,
  date,
  urgencyLabel,
  statusLabel,
}) => {
  const urgencyData = priotityToHE(urgency);
  return (
    <ClientWrapper key={"wrapper-" + id}>
      <Card className="flex min-w-[280px] max-w-[340px] flex-1 grow flex-col self-start sm:basis-1/3 xl:basis-1/4">
        <CardHeader className="flex flex-row flex-wrap items-start gap-4 gap-y-0">
          <div className="flex-0 grow basis-0 flex-col gap-y-1">
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          </div>
          <div className="flex w-fit items-center gap-x-1 rounded-md bg-secondary text-secondary-foreground">
            <Suspense fallback={<Skeleton className="h-8 w-24" />}>
              <RequestCallCardActions
                id={id}
                title={title}
                urgency={urgency}
                status={status}
              />
            </Suspense>
          </div>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <ShieldAlert
                className={`fill-${urgencyData.color} text-${urgencyData.color} me-1 h-3 w-3`}
              />
              {urgencyLabel}
            </div>
            <div className="flex items-center">
              <Settings className="me-1 h-3 w-3" />
              {statusLabel}
            </div>
            <div>{date}</div>
          </div>
        </CardContent>
      </Card>
    </ClientWrapper>
  );
};
