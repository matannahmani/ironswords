"use client";
import { ticketPriority } from "@/app/operators/tickets/data/data";
import { tickets } from "@/server/db/schema";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Textarea } from "@ui/textarea";

export const RequestCard: React.FC<Partial<typeof tickets.$inferInsert>> = (
  props,
) => {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>פתח פנייה</CardTitle>
        <CardDescription>
          {/* What area are you having problems with? */}
          מה נושא הפנייה?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="area">אזור</Label>
            <Select disabled defaultValue="eilat">
              <SelectTrigger id="area">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="eilat">אילת</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="deployments">Deployments</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="security-level">דרגת דחיפות</Label>
            <Select defaultValue="2">
              <SelectTrigger
                id="security-level"
                className="line-clamp-1 w-[160px] truncate"
              >
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {ticketPriority.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    <div className="flex flex-row items-center justify-start">
                      {p.icon && <p.icon className="me-2 h-4 w-4" />}

                      {p.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="subject">כותרת</Label>
          <Input id="subject" placeholder="אני צריך עזרה בה..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">תיאור</Label>
          <Textarea
            id="description"
            placeholder="פרט את הבעיה שלך כמה שיותר מפורט"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button variant="ghost">בטל</Button>
        <Button>פתיחה</Button>
      </CardFooter>
    </Card>
  );
};
