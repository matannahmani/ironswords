"use client";

import { RouterOutputs } from "@/trpc/shared";
import { atom, useAtom } from "jotai";
import React from "react";

const citiesAtom = atom<RouterOutputs["city"]["all"]>([]);

export const useCities = () => {
  const [cities, setCities] = useAtom(citiesAtom);
  return [cities, setCities] as const;
};

export const CitiesInitializer: React.FC<{
  cities: RouterOutputs["city"]["all"];
}> = ({ cities }) => {
  const [, setCities] = useCities();
  React.useEffect(() => {
    setCities(cities);
  }, [cities]);
  return null;
};
