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

import { Button } from "@ui/button";
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex w-fit">
                  <Button variant="secondary" className=" px-3 shadow-none">
                    <PencilRuler className="h-4 w-4 sm:me-2" />
                    <span className="hidden sm:block">פעולות</span>
                  </Button>
                  <Separator
                    orientation="vertical"
                    className="hidden h-[20px] sm:block"
                  />
                  <Button
                    variant="secondary"
                    className="hidden px-2 shadow-none sm:flex"
                  >
                    <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                alignOffset={-5}
                className="w-[200px]"
                forceMount
              >
                <DropdownMenuLabel>פעולות על פנייה</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuSelectItem>
                      <Share className="me-2 h-4 w-4" />
                      שתף פנייה
                    </DropdownMenuSelectItem>
                  </DialogTrigger>
                  <DialogContent>
                    <RequestShareCard ticket_id={id} />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuSelectItem disabled={status !== "OPEN"}>
                      <Play className="me-2 h-4 w-4" />
                      קבל פנייה
                    </DropdownMenuSelectItem>
                  </DialogTrigger>
                  <DialogContent>
                    <RequestTakeCard name={title} ticketId={id} />
                  </DialogContent>
                </Dialog>
                <DropdownMenuItem disabled>
                  <Bookmark className="me-2 h-4 w-4" />
                  סמן כמועדף
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex gap-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <ShieldAlert className="fill-warning text-warning me-1 h-3 w-3" />
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
