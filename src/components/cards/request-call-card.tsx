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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Separator } from "@ui/separator";
import ClientWrapper from "../utils/client-wrapper";

export const RequestCallCard: React.FC<{
  title: string;
  description: string;
  id: string;
  urgency: string;
  status: string;
  date: string;
}> = ({ title, description, id, urgency, status, date }) => {
  return (
    <ClientWrapper key={"wrapper-" + id}>
      <Card className="flex min-w-[280px] max-w-[340px] flex-1 grow flex-col self-start sm:basis-1/3 xl:basis-1/4">
        <CardHeader className="flex flex-row flex-wrap items-start gap-4 space-y-0">
          <div className="flex-0 grow basis-0 flex-col space-y-1">
            <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          </div>
          <div className="flex w-fit items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex w-fit">
                  <Button variant="secondary" className=" px-3 shadow-none">
                    <PencilRuler className="h-4 w-4 sm:mr-2" />
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
                <DropdownMenuItem>
                  <Play className="mr-2 h-4 w-4" />
                  קבל פנייה
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Share className="mr-2 h-4 w-4" />
                  שתף פנייה
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Bookmark className="mr-2 h-4 w-4" />
                  סמן כמועדף
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <ShieldAlert className="fill-warning text-warning mr-1 h-3 w-3" />
              {urgency}
            </div>
            <div className="flex items-center">
              <Settings className="mr-1 h-3 w-3" />
              {status}
            </div>
            <div>{date}</div>
          </div>
        </CardContent>
      </Card>
    </ClientWrapper>
  );
};
