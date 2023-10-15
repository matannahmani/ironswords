"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";

export function ModeToggler() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-9 px-0">
          <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          מצב בהיר
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          מצב כהה
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          מצב מערכת
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
