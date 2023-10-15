"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@ui/card";
import { Input } from "@ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/select";
import { Separator } from "@ui/separator";
import { SiFacebook, SiMessenger, SiWhatsapp } from "react-icons/si";
import { toast } from "../ui/use-toast";

export function RequestShareCard({ ticket_id }: { ticket_id: string }) {
  return (
    <Card className="border-none">
      <CardHeader>
        <CardTitle>שתף פנייה</CardTitle>
        <CardDescription>
          {/* Anyone with the link can view this document. */}
          כל אחד עם הקישור יכול לצפות בפנייה זו
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-x-2">
          <Input
            value={`https://ironswords.xyz/?ticket_id=${ticket_id}`}
            readOnly
          />
          <Button
            onClick={() => {
              void navigator.clipboard.writeText(
                `https://ironswords.xyz/?ticket_id=${ticket_id}`,
              );
              toast({
                title: "הקישור הועתק בהצלחה",
                variant: "success",
              });
            }}
            variant="secondary"
            className="shrink-0"
          >
            העתק קישור
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          <h4 className="text-sm font-medium">שתף ברשתות חברתיות</h4>
          <div className="flex flex-row gap-2">
            <Button variant="secondary" className="shrink-0">
              <SiFacebook className="h-4 w-4" />
            </Button>
            <Button variant="secondary" className="shrink-0">
              <SiWhatsapp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
