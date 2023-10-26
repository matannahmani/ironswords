"use client";

import { Button } from "@/components/ui/button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { atom, useAtom, useAtomValue } from "jotai";
import React from "react";

export const viewModeAtom = atom<"operators" | "invites">("operators");

export const useViewValue = () => useAtomValue(viewModeAtom);

const ViewSwitch: React.FC = () => {
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [ref] = useAutoAnimate();
  return (
    <div ref={ref} className="w-36">
      <Button
        key={viewMode}
        onClick={() =>
          setViewMode(viewMode === "operators" ? "invites" : "operators")
        }
        className="w-36"
        variant="secondary"
      >
        לצפייה ב{viewMode === "operators" ? "הזמנות" : "מתאמים"}
      </Button>
    </div>
  );
};
export default ViewSwitch;
