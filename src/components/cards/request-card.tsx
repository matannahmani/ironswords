"use client";
import { ticketPriority } from "@/app/operators/[locationId]/tickets/data/data";
import { type tickets } from "@/server/db/schema";
import { api } from "@/trpc/react";
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
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { ticketCategories } from "@/shared/zod/ticketCategories";

export const RequestCard: React.FC<
  Partial<typeof tickets.$inferSelect & { readonly?: boolean }>
> = (props) => {
  const client = api.useContext();
  const updateMutation = api.tickets.updateOne.useMutation({
    onSuccess: () => {
      void client.location.tickets.invalidate({
        location_id: props.location_id,
      });
      toast({
        title: "פנייה עודכנה בהצלחה",
        variant: "success",
      });
      const closeBTN = document.getElementById("close-btn");
      if (closeBTN) {
        closeBTN.click();
      }
    },
    onError: () => {
      toast({
        title: "שגיאה בעדכון הפנייה",
        variant: "destructive",
      });
    },
  });
  const mutation = api.tickets.createOne.useMutation({
    onSuccess: () => {
      void client.location.tickets.invalidate({
        location_id: props.location_id,
      });
      toast({
        title: "פנייה נשלחה בהצלחה",
        variant: "success",
      });
      const closeBTN = document.getElementById("close-btn");
      if (closeBTN) {
        closeBTN.click();
      }
    },
    onError: () => {
      toast({
        title: "שגיאה בשליחת הפנייה",
        variant: "destructive",
      });
    },
  });
  const isLoading = mutation.isLoading || updateMutation.isLoading;
  const [state, setState] = useState<Partial<typeof tickets.$inferSelect>>({
    ...props,
  });
  useEffect(() => {
    setState((prev) => props);
  }, [props]);
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>
          {props.readonly
            ? "צפייה בפנייה"
            : state.ticket_id
            ? "עריכת פנייה"
            : "פתיחת פנייה"}
        </CardTitle>
        <CardDescription>
          {/* What area are you having problems with? */}
          {/* מה נושא הפנייה? */}
          {props.readonly
            ? `מזהה פנייה: ${state.ticket_id}`
            : state.ticket_id
            ? `מזהה פנייה: ${state.ticket_id}`
            : "פתיחת פנייה"}
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
                <SelectItem value="eilat">אילת</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="security-level">דרגת דחיפות</Label>
            <Select
              disabled={props.readonly}
              onValueChange={(value) =>
                setState((prev) => ({
                  ...prev,
                  priority: value as typeof state.priority,
                }))
              }
              value={state.priority ?? ""}
            >
              <SelectTrigger
                id="security-level"
                className="line-clamp-1 w-[160px] truncate"
              >
                <SelectValue placeholder="דרגת דחיפות" />
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
          <Label htmlFor="title">כותרת</Label>
          <Input
            disabled={props.readonly}
            value={state.title ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, title: event.target.value }))
            }
            id="title"
            placeholder="אני צריך עזרה בה..."
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">תיאור</Label>
          <Textarea
            disabled={props.readonly}
            value={state.description ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, description: event.target.value }))
            }
            id="description"
            placeholder="פרט את הבעיה שלך כמה שיותר מפורט"
          />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              פרטי מבקש העזרה
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="requester_fullname">שם מלא</Label>
            <Input
              disabled={props.readonly}
              value={state.requester_fullname ?? ""}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  requester_fullname: event.target.value,
                }))
              }
              id="requester_fullname"
              placeholder="שם פרטי ושם משפחה"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requester_phone">טלפון</Label>
            <Input
              disabled={props.readonly}
              value={state.requester_phone ?? ""}
              onChange={(event) =>
                setState((prev) => ({
                  ...prev,
                  requester_phone: event.target.value,
                }))
              }
              id="requester_phone"
              placeholder="054-222-3333"
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ticket_category">קטגוריה</Label>
          <Select
            disabled={props.readonly}
            defaultValue={state.category ?? ""}
            onValueChange={(value: string) =>
              setState((prev) => ({
                ...prev,
                category: value as (typeof ticketCategories)[number],
              }))
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="בחר קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              {ticketCategories.map((category, index) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">הערות נוספות</Label>
          <Textarea
            disabled={props.readonly}
            value={state.notes ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, notes: event.target.value }))
            }
            id="notes"
            placeholder="כל מה שאתה רוצה להוסיף"
          />
        </div>
      </CardContent>
      <CardFooter className="justify-between space-x-2">
        <Button
          onClick={() => {
            const closeBTN = document.getElementById("close-btn");
            if (closeBTN) {
              closeBTN.click();
            }
          }}
          variant="ghost"
        >
          בטל
        </Button>
        <Button
          disabled={props.readonly ?? isLoading}
          onClick={() => {
            if (state.ticket_id) {
              // @ts-expect-error - TODO: fix this
              void updateMutation.mutateAsync(state);
            }
            // @ts-expect-error - TODO: fix this
            else void mutation.mutateAsync(state);
          }}
        >
          {isLoading && <Loader2 className="me-2 h-5 w-5 animate-spin" />}

          {!isLoading
            ? state.ticket_id
              ? "עדכן פנייה"
              : "שלח פנייה"
            : "מעדכן..."}
        </Button>
      </CardFooter>
    </Card>
  );
};
