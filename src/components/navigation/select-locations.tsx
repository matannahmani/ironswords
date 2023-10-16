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
import {
  usePathname,
  useSearchParams,
  useRouter,
  useParams,
} from "next/navigation";
import { useEffect, useState } from "react";

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
  const params = useParams() ?? ({} as { location_id?: string });
  const router = useRouter();
  const [value, setValue] = useState("");
  useEffect(() => {
    if (params.location_id && typeof params.location_id === "string") {
      setValue(params.location_id);
      router.push(`./${params.location_id}`);
      return;
    }
  }, [params, pathname]);

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        setValue(v);
        router.push(`./${v}`);
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
