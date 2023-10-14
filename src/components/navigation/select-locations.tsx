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
      return;
    }
    if (locationId !== value) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("location_id", value);
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
        <SelectValue placeholder="Select a fruit" />
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
