"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";

const SearchFilter: React.FC<{
  paramName: string;
  label: string;
  items: {
    value: string;
    label: string | React.ReactNode;
  }[];
}> = ({ paramName, label, items }) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [val, setVal] = useState<string | undefined>(
    searchParams.get(paramName) ?? undefined,
  );
  const onSelect = (v: string) => {
    // if includes, remove, else add
    const newParams = new URLSearchParams(searchParams.toString());
    if (v === "clear") {
      newParams.delete(paramName);
      setVal("");
      return router.push(pathname + "?" + newParams.toString());
    }
    newParams.set(paramName, v);
    setVal(v);
    router.push(pathname + "?" + newParams.toString());
  };
  return (
    <Select onValueChange={(v) => onSelect(v)} value={val}>
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={`
        Select ${paramName}
        `}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((item) => (
            <SelectItem
              onClick={() => onSelect(item.value)}
              key={item.value}
              value={item.value}
            >
              {item.label}
            </SelectItem>
          ))}
          <SelectItem value="clear">Clear {label}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SearchFilter;
