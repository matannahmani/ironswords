import { type tickets } from "@/server/db/schema";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { AlertTriangle, CircleDot } from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

type dataPoint<T extends string> = {
  label: string;
  value: T;
  icon?: React.ComponentType<{ className?: string }>;
}[];

export const ticketStatus: dataPoint<
  NonNullable<typeof tickets.$inferSelect.status>
> = [
  {
    label: "טופל",
    value: "CLOSED",
    icon: CheckCircledIcon,
  },
  {
    label: "פתוח",
    value: "OPEN",
    icon: CircleIcon,
  },
  {
    label: "בתהליך",
    value: "ASSIGNED",
    icon: StopwatchIcon,
  },
];

export const ticketPriority: dataPoint<
  NonNullable<typeof tickets.$inferSelect.priority>
> = [
  {
    label: "לא דחוף",
    value: "LOW",
    icon: ArrowDownIcon,
  },
  {
    label: "בינוני",
    value: "MID",
    icon: ArrowRightIcon,
  },
  {
    label: "דחוף",
    value: "HIGH",
    icon: ArrowUpIcon,
  },
  {
    label: "דחוף ביותר",
    value: "URGENT",
    icon: AlertTriangle,
  },
];
