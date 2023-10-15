import {
  Bookmark,
  ChevronDownIcon,
  PencilRuler,
  Play,
  Settings,
  Share,
  ShieldAlert,
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
import { priotityToHE } from "@/shared/zod/base";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

export const RequestCallCardActions: React.FC<{
  title: string;
  id: string;
  urgency: typeof tickets.$inferSelect.priority;
  status: typeof tickets.$inferSelect.status;
}> = ({ title, id, urgency, status }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            "flex w-fit px-3 shadow-none",
            buttonVariants({
              variant: "secondary",
            }),
          )}
        >
          <PencilRuler className="h-4 w-4 sm:me-2" />
          <span className="hidden sm:block">פעולות</span>
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
  );
};

export default RequestCallCardActions;
