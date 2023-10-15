"use client";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "../ui/button";
import { ModeToggler } from "./mode-toggler";
import { Separator } from "../ui/separator";
import { DashboardIcon } from "@radix-ui/react-icons";

const SidebarItem: React.FC<{
  isSelected?: boolean;
  title: string;
  href: string;
  icon: React.ReactNode;
}> = ({ isSelected, title, href, icon }) => (
  <nav
    className={cn(
      "self-stretc flex w-full flex-col px-5 py-3",
      isSelected &&
        "bg-primary/10 text-primary/90 dark:bg-primary dark:text-primary-foreground",
    )}
  >
    <Link
      href={href}
      className={cn("my-auto w-full self-center text-base font-medium")}
    >
      <div className="mr-2.5 flex items-start gap-2.5">
        {icon}
        {title}
      </div>
    </Link>
  </nav>
);

const navItems: {
  href: string;
  title: string;
  icon: React.ReactNode;
  isOperator?: boolean;
}[] = [
  {
    href: "/",
    title: "בית",
    icon: <Home size={24} />,
  },
  {
    href: "/operators/tickets",
    title: "ניהול פניות",
    icon: <LayoutDashboard size={24} />,
    isOperator: true,
  },
  {
    href: "/my-tickets",
    title: "הפניות שלי",
    icon: <Tags size={24} />,
  },
];

export default function Sidebar({
  containerClassName,
}: {
  containerClassName?: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "border-r-border-20 sticky top-0 z-10 hidden h-screen w-[240px] max-w-full flex-col border-l border-r border-solid bg-background pb-10 pt-[22px] text-foreground md:flex",
        containerClassName,
      )}
    >
      <h1 className="mr-0 self-center text-2xl font-semibold uppercase">
        חרבות ברזל
      </h1>

      <div className="mt-12 flex flex-col justify-center gap-4">
        {navItems.map((item, index) => (
          <SidebarItem
            isSelected={pathname === item.href}
            key={item.href}
            href={item.href}
            title={item.title}
            icon={item.icon}
          />
        ))}
      </div>
      <div className="mt-auto flex flex-row justify-evenly">
        <Button disabled size="sm" variant="ghost">
          לתרומות
        </Button>
        <Separator orientation="vertical" />
        <ModeToggler />
      </div>
    </aside>
  );
}
