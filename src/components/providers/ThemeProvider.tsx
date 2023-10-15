"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

import { TooltipProvider } from "@ui/tooltip";
import { Toaster } from "../ui/toaster";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <Toaster />
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemesProvider>
  );
}
