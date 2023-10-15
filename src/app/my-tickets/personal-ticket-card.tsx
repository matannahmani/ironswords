"use client";

import { Textarea } from "@/components/ui/textarea";
import { priotityToHE, statusToHE } from "@/shared/zod/base";
import { RouterOutputs } from "@/trpc/shared";
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
import { Check, Settings, ShieldAlert, Trash2 } from "lucide-react";

export function PersonalTicketCard({
  ticketData,
}: {
  ticketData: RouterOutputs["tickets"]["myPersoanlTickets"][number];
}) {
  const { ticket } = ticketData;
  const urgencyData = priotityToHE(ticket?.priority ?? "LOW");
  const urgencyLabel = urgencyData.label;
  const statusLabel = statusToHE(ticket?.status ?? "OPEN")?.label ?? "פתוחה";
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">פנייה: {ticket?.title}</CardTitle>
        <CardDescription>להלן הפעולות האפשריות</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <Trash2 className="me-2 h-4 w-4" />
            שחרר פנייה
          </Button>
          <Button variant="outline">
            <Check className="me-2 h-4 w-4" />
            סמן כבוצע
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              פרטי הפנייה
            </span>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">כותרת</Label>
          <Input id="title" type="text" readOnly value={ticket?.title} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">תיאור</Label>
          <Textarea
            id="description"
            readOnly
            value={ticket?.description ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="operator-phone">מתאם טלפון</Label>
          <Input
            id="operator-phone"
            readOnly
            value={ticket?.operator?.phone ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="operator-name">שם מתאם</Label>
          <Input
            id="operator-name"
            readOnly
            value={ticket?.operator?.name ?? ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="operator-addons">פרטים נוספים</Label>
          <Textarea
            id="operator-addons"
            readOnly
            value={ticket?.operator?.contact_info ?? ""}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <ShieldAlert
              className={`fill-${urgencyData.color} text-${urgencyData.color} me-1 h-3 w-3`}
            />
            {urgencyLabel}
          </div>
          <div className="flex items-center">
            <Settings className="me-1 h-3 w-3" />
            {statusLabel}
          </div>
          <div>{ticket?.created_at?.toLocaleDateString()}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
