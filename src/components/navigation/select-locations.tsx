"use client";
import { type RouterOutputs } from "@/trpc/shared";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@ui/select";
import { Link } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const setClientSideCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/`;
};

export const SelectLocationWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ children, fallback }) => {
  const pathname = usePathname();
  if (!pathname.includes("operators")) return fallback ?? null;
  return <>{children}</>;
};

export const SelectLocations: React.FC<{
  locations: RouterOutputs["user"]["myLocations"]["locations"];
}> = ({ locations }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState("");
  useEffect(() => {
    const locationId = searchParams.get("location_id");
    if (!pathname.includes("operators")) return;
    if (value === "" && locationId) {
      setValue(locationId);
      setClientSideCookie("location_id", locationId);
      return;
    }
    if (locationId !== value) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("location_id", value);
      setClientSideCookie("location_id", value);
      router.push(`${pathname}?${newParams.toString()}`);
    }
  }, [searchParams, pathname]);

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("location_id", v);
        router.push(`${pathname}?${newParams.toString()}`);
        setValue(v);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="בחר מיקום" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>מיקום</SelectLabel>
          {locations.map((location) => (
            <SelectItem
              key={location.location_id}
              value={location.location_id ?? "_"}
            >
              {location.location?.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
