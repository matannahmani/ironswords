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

export const statuses = [
  {
    label: "טופל",
    value: "DONE",
    icon: CheckCircledIcon,
  },
  {
    label: "פתוח",
    value: "OPEN",
    icon: CircleIcon,
  },
  {
    label: "בתהליך",
    value: "IN PROGRESS",
    icon: StopwatchIcon,
  },
];

export const priorities = [
  {
    label: "לא דחוף",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "בינוני",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "דחוף",
    value: "high",
    icon: ArrowUpIcon,
  },
  {
    label: "דחוף ביותר",
    value: "urgent",
    icon: AlertTriangle,
  },
];
