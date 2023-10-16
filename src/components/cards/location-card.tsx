"use client";
import { ticketPriority } from "@/app/operators/tickets/data/data";
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
import { type locations } from "@/server/db/schema";
import { RouterOutputs } from "@/trpc/shared";

export const LocationCard: React.FC<
  Partial<typeof locations.$inferSelect & { readonly?: boolean }> & {
    cities: RouterOutputs["city"]["all"];
  }
> = (props) => {
  const client = api.useContext();
  const updateMutation = api.location.updateOne.useMutation({
    onSuccess: () => {
      void client.location.getMany.invalidate();
      toast({
        title: "מיקום עודכן בהצלחה",
        variant: "success",
      });
      const closeBTN = document.getElementById("close-btn");
      if (closeBTN) {
        closeBTN.click();
      }
    },
    onError: () => {
      toast({
        title: "שגיאה בעדכון המיקום",
        variant: "destructive",
      });
    },
  });
  const mutation = api.location.createOne.useMutation({
    onSuccess: () => {
      void client.location.getMany.invalidate();
      toast({
        title: "מיקום נפתח בהצלחה",
        variant: "success",
      });
      const closeBTN = document.getElementById("close-btn");
      if (closeBTN) {
        closeBTN.click();
      }
    },
    onError: () => {
      toast({
        title: "שגיאה בפתיחת המיקום",
        variant: "destructive",
      });
    },
  });
  const isLoading = mutation.isLoading || updateMutation.isLoading;
  const [state, setState] = useState<Partial<typeof locations.$inferSelect>>({
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
            ? "צפייה במיקום"
            : state.location_id
            ? "עריכת מיקום"
            : "פתיחת מיקום"}
        </CardTitle>
        <CardDescription>
          {/* What area are you having problems with? */}
          {/* מה נושא המיקום? */}
          {props.readonly
            ? `מזהה מיקום: ${state.location_id}`
            : state.location_id
            ? `מזהה מיקום: ${state.location_id}`
            : "פתיחת מיקום"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="area">עיר</Label>
            <Select
              disabled={props.readonly}
              defaultValue={props.city_id ?? ""}
            >
              <SelectTrigger id="area">
                <SelectValue placeholder="בחר עיר" />
              </SelectTrigger>
              <SelectContent>
                {props.cities.map((city) => (
                  <SelectItem key={city.city_id} value={city.city_id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name">שם</Label>
          <Input
            disabled={props.readonly}
            value={state.name ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, name: event.target.value }))
            }
            id="name"
            placeholder="שם הנקודה"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="address">כתובת</Label>
          <Textarea
            disabled={props.readonly}
            value={state.address ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, address: event.target.value }))
            }
            id="address"
            placeholder="כתובת הנקודה"
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
            if (state.location_id) {
              // @ts-expect-error - TODO: fix this
              void updateMutation.mutateAsync(state);
            } else void mutation.mutateAsync(state);
          }}
        >
          {isLoading && <Loader2 className="me-2 h-5 w-5 animate-spin" />}

          {!isLoading
            ? state.location_id
              ? "עדכן מיקום"
              : "שלח מיקום"
            : "מעדכן..."}
        </Button>
      </CardFooter>
    </Card>
  );
};
