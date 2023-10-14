import {
  Bell,
  BellDot,
  ChevronDown,
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import MobileMenuToggler from "./mobile-menu-toggler";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { api } from "@/trpc/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LoginOrAvatar = async () => {
  const { session } = await api.user.whoami.query();
  if (!!session?.user)
    return (
      <div className="flex w-fit max-w-full items-start justify-between gap-3 self-stretch  py-1 pl-1.5 pr-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-start justify-between gap-3 self-stretch">
              <Avatar>
                <AvatarImage src={session.user.image ?? ""} />
                <AvatarFallback>
                  {session.user.name?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="my-auto hidden self-center text-base font-semibold  md:block">
                {session.user.name}
              </div>
              <ChevronDown size={24} className="my-auto self-center" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>History</span>
                <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

  return (
    <Link href="/login" className={buttonVariants({ size: "sm" })}>
      Login
    </Link>
  );
};

export default function NavbarHeader() {
  return (
    <section className="sticky top-0 z-10 border-b border-border ">
      <article className="flex w-full flex-col self-stretch bg-background px-5 py-4 shadow-[0px_4px_40px_1px_rgba(0,0,0,0.03)] max-md:max-w-full">
        <header className="-mt-px flex w-full  items-start justify-between gap-5 self-center max-md:max-w-full max-md:flex-wrap">
          <div className="my-auto flex items-start gap-3.5 self-center">
            <MobileMenuToggler />
            <div
              className={cn(
                "my-auto hidden self-center text-lg font-semibold md:block",
              )}
            >
              <span className="font-semibold">Call Center</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 self-stretch">
            <Button size="icon" variant="outline" className="rounded-full">
              <div className="relative">
                <Bell size={24} className="relative"></Bell>
                <div className="absolute right-[2.5px] top-1 h-2 w-2 rounded-full bg-destructive" />
              </div>
            </Button>
            <Suspense
              fallback={<Skeleton className="h-10 w-10 rounded-full" />}
            >
              <LoginOrAvatar />
            </Suspense>
          </div>
        </header>
      </article>
    </section>
  );
}
