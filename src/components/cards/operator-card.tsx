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
import { Badge, CheckIcon, Loader2, Utensils } from "lucide-react";
import { type operators } from "@/server/db/schema";
import { RouterOutputs } from "@/trpc/shared";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { useCities } from "@/app/operators/components/cities-context";

type operator = RouterOutputs["operator"]["getMany"]["page"][number];

export const OperatorCard: React.FC<
  Partial<operator & { readonly?: boolean }>
> = (props) => {
  const client = api.useContext();
  const [cityId, setCityId] = useState<string | null>(null);
  const [cities, _] = useCities();
  const { data: locations, isLoading: locationsLoading } =
    api.city.locations.useQuery(
      {
        city_id: cityId as string,
      },
      {
        enabled: !!cityId,
        keepPreviousData: true,
      },
    );
  const updateMutation = api.operator.updateOne.useMutation({
    onSuccess: () => {
      void client.operator.getMany.invalidate();
      toast({
        title: "מתאם עודכן בהצלחה",
        variant: "success",
      });
      const closeBTN = document.getElementById("close-btn");
      if (closeBTN) {
        closeBTN.click();
      }
    },
    onError: () => {
      toast({
        title: "שגיאה בעדכון המתאם אנא וודא שהאיימל רשום במערכת",
        variant: "destructive",
      });
    },
  });
  const mutation = api.operator.createOne.useMutation({
    onSuccess: () => {
      void client.operator.getMany.invalidate();
      toast({
        title: "מתאם נפתח בהצלחה",
        variant: "success",
      });
      const closeBTN = document.getElementById("close-btn");
      if (closeBTN) {
        closeBTN.click();
      }
    },
    onError: () => {
      toast({
        title: "שגיאה בפתיחת המתאם",
        variant: "destructive",
      });
    },
  });
  const isLoading = mutation.isLoading || updateMutation.isLoading;
  const [locationIds, setLocationIds] = useState<string[]>([
    ...(props.locationOperators?.map((locOp) => locOp.location_id ?? "_") ??
      []),
  ]);
  const [state, setState] = useState<Partial<operator>>({
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
            ? "צפייה במתאם"
            : state.operator_id
            ? "עריכת מתאם"
            : "פתיחת מתאם"}
        </CardTitle>
        <CardDescription>
          {/* What area are you having problems with? */}
          {/* מה נושא המתאם? */}
          {props.readonly
            ? `מזהה מתאם: ${state.operator_id}`
            : state.operator_id
            ? `מזהה מתאם: ${state.operator_id}`
            : "פתיחת מתאם"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="area">עיר</Label>
            <Select onValueChange={(value) => setCityId(value)}>
              <SelectTrigger id="area">
                <SelectValue placeholder="בחר עיר" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.city_id} value={city.city_id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">נקודות</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Button
                    disabled={props.readonly || !!locationsLoading}
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !locationIds && "text-muted-foreground",
                    )}
                  >
                    {locationsLoading && (
                      <Loader2 className="me-2 h-5 w-5 animate-spin" />
                    )}
                    {locationIds && locationIds?.length > 0
                      ? `${locationIds.length} נקודות נבחרו`
                      : "בחר נקודות"}
                    <Utensils className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="חפש נקודות" className="h-9" />
                  <ScrollArea className="h-[200px]">
                    <CommandEmpty>No Food Theme found.</CommandEmpty>
                    <CommandGroup>
                      {locations?.map((loc) => (
                        <CommandItem
                          value={loc.name ?? "שם לא ידוע"}
                          key={loc.location_id}
                          onSelect={() => {
                            const isIn = locationIds.includes(loc.location_id);
                            if (isIn) {
                              setLocationIds((prev) =>
                                prev.filter((id) => id !== loc.location_id),
                              );
                              return;
                            }
                            setLocationIds((prev) => [
                              ...prev,
                              loc.location_id,
                            ]);
                          }}
                        >
                          {loc.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              locationIds.includes(loc.location_id)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </ScrollArea>
                </Command>
              </PopoverContent>
            </Popover>
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
            placeholder="שם המתאם"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">טלפון</Label>
          <Input
            disabled={props.readonly}
            value={state.phone ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, phone: event.target.value }))
            }
            id="phone"
            placeholder="טלפון המתאם"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">אימייל</Label>
          <Input
            disabled={props.readonly || !!state.operator_id}
            value={state.email ?? ""}
            onChange={(event) =>
              setState((prev) => ({ ...prev, email: event.target.value }))
            }
            id="email"
            placeholder="אימייל המתאם"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact_info">פרטי יצירת קשר</Label>
          <Textarea
            disabled={props.readonly}
            value={state.contact_info ?? ""}
            onChange={(event) =>
              setState((prev) => ({
                ...prev,
                contact_info: event.target.value,
              }))
            }
            id="contact_info"
            placeholder="פרטי יצירת קשר"
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
            if (state.operator_id) {
              void updateMutation.mutateAsync({
                location_ids: locationIds,
                contact_info: state.contact_info,
                operator_id: state.operator_id,
                email: state.email,
                name: state.name as string,
                phone: state.phone,
              });
            } else
              void mutation.mutateAsync({
                location_ids: locationIds,
                contact_info: state.contact_info,
                email: state.email as string,
                name: state.name,
                phone: state.phone,
              });
          }}
        >
          {isLoading && <Loader2 className="me-2 h-5 w-5 animate-spin" />}

          {!isLoading
            ? state.operator_id
              ? "עדכן מתאם"
              : "שלח מתאם"
            : "מעדכן..."}
        </Button>
      </CardFooter>
    </Card>
  );
};
