import type React from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "./sidebar";

const MobileMenuToggler: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full md:hidden"
        >
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <Sidebar containerClassName="flex border-none" />
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenuToggler;
