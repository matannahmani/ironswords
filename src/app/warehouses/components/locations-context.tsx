"use client";

import { RouterOutputs } from "@/trpc/shared";
import { atom, useAtom } from "jotai";
import React from "react";

const locationsAtom = atom<RouterOutputs["location"]["all"]>([]);

export const useLocations = () => {
    const [locations, setLocations] = useAtom(locationsAtom);
    return [locations, setLocations] as const;
};

export const LocationsInitializer: React.FC<{
    locations: RouterOutputs["location"]["all"];
}> = ({ locations }) => {
    const [, setLocations] = useLocations();
    React.useEffect(() => {
        setLocations(locations);
    }, [locations]);
    return null;
};
