"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
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
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import { SiGoogle } from "react-icons/si";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "../ui/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function RequestTakeCard({
  name,
  ticketId,
}: {
  name: string;
  ticketId: string;
}) {
  const [ref] = useAutoAnimate();
  const session = useSession();
  const router = useRouter();
  const client = api.useContext();
  const [input, setInput] = useState({
    name: "",
    tel: "",
    freeText: "",
    needTransport: false,
  });
  const isValid = input.name && input.tel && session.data;
  const mutation = api.tickets.acceptTicket.useMutation({
    onSuccess: () => {
      toast({
        title: "הפנייה נקלטה בהצלחה",
        variant: "success",
      });
      const closeBtn = document.getElementById("close-btn");
      closeBtn?.click();
      //   oid client.city.tickets.invalidate({
      //     city_id: "66rnmiNulGHzRz_qKLTeW",
      //   });
      router.refresh();
    },
    onError: (err) => {
      toast({
        title: "הפנייה לא נקלטה",
        variant: "destructive",
      });
    },
  });
  return (
    <Card className="mx-auto w-[90%] max-w-[420px] border-none" ref={ref}>
      <CardHeader className="space-y-1">
        <CardTitle className="max-w-[90%] overflow-hidden truncate text-2xl">
          פנייה: {name}
        </CardTitle>
        <CardDescription>
          לקבלת הפנייה{" "}
          {!!session.data ? "אנא מלא פרטי קשר" : "אנא התחבר ומלא פרטי קשר"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {!session.data && (
          <div className="grid grid-cols-2 gap-6">
            <Button
              disabled={session.status === "loading" || !!session.data}
              onClick={() => {
                void signIn("google");
              }}
              variant="outline"
              className="flex-start w-fit items-center justify-start"
            >
              <SiGoogle className="me-2 h-4 w-4" />
              המשך עם גוגל
            </Button>
          </div>
        )}
        {!!session.data && (
          <div className="flex flex-col gap-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  פרטי קשר
                </span>
              </div>
            </div>
            <div className="grid w-[200px] gap-2">
              <Label htmlFor="name">שם</Label>
              <Input
                onChange={(e) => {
                  setInput((prev) => ({ ...prev, name: e.target.value }));
                }}
                value={input.name}
                id="name"
                type="name"
                placeholder="שם פרטי ושם משפחה"
              />
            </div>
            <div className="grid w-[200px] gap-2">
              <Label htmlFor="tel">טלפון</Label>
              <Input
                placeholder="054-222-3333"
                value={input.tel}
                onChange={(e) => {
                  setInput((prev) => ({ ...prev, tel: e.target.value }));
                }}
                id="tel"
                type="tel"
              />
            </div>
            <div className="grid w-[200px] gap-2">
              <Label htmlFor="free-text">הערות שולים</Label>
              <Textarea
                id="free-text"
                placeholder="כל מה שאתה רוצה להוסיף"
                value={input.freeText}
                onChange={(e) => {
                  setInput((prev) => ({ ...prev, freeText: e.target.value }));
                }}
              />
            </div>
            <div className="flex h-8 w-[200px] flex-row items-center gap-2">
              <Checkbox
                onCheckedChange={(checked) => {
                  setInput((prev) => ({ ...prev, needTransport: !!checked }));
                }}
                value={input.needTransport ? "true" : "false"}
                id="needTransport"
              />
              <Label htmlFor="needTransport">צריך שינועה ? (לא חובה)</Label>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => {
            mutation.mutate({
              name: input.name,
              telephone: input.tel,
              freeText: input.freeText,
              needTransport: input.needTransport,
              ticket_id: ticketId,
            });
          }}
          disabled={!isValid || mutation.isLoading}
          className="w-full"
        >
          <Loader2
            className={`me-2 ${
              mutation.isLoading ? "block" : "hidden"
            } h-6 w-6 animate-spin`}
          />
          {mutation.isLoading ? "מעבד..." : "קבל את הפנייה"}
          {/* קבל את הפנייה */}
        </Button>
      </CardFooter>
    </Card>
  );
}
