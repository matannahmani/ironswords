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
import { useForm } from "react-hook-form";
import { insertOperatorSchema } from "@/shared/zod/base";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodErrorMap } from "@/shared/zod/errors";
type operator = RouterOutputs["operator"]["getMany"]["page"][number];
type Required<T> = {
  [P in keyof T]-?: T[P];
};
const schema = insertOperatorSchema
  .omit({
    user_id: true,
  })
  .extend({
    city: z.string().nullable(),
    location_ids: z.array(z.string()),
  });
z.setErrorMap(zodErrorMap);
export const OperatorCard: React.FC<
  Partial<operator & { readonly?: boolean }>
> = (props) => {
  const client = api.useContext();
  const [cities, _] = useCities();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...props,
      location_ids: [
        ...(props.locationOperators?.map((locOp) => locOp.location_id ?? "_") ??
          []),
      ] as string[],
    },
    mode: "all",
  });
  const cityId = form.watch("city");
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
  const mutation = api.operatorInvites.createOne.useMutation({
    onSuccess: () => {
      void client.operatorInvites.getMany.invalidate();
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

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (props.operator_id) {
      updateMutation.mutate({
        ...data,
        operator_id: props.operator_id,
      });
      return;
    }
    mutation.mutate({
      email: data.email,
      payload: {
        ...data,
        location_ids: data.location_ids,
      },
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" style={{overflowX:"auto", maxHeight:"85vh"}} >
        <Card className="border-none">
          <CardHeader>
            <CardTitle>
              {props.readonly
                ? "צפייה במתאם"
                : props.operator_id
                ? "עריכת מתאם"
                : "פתיחת מתאם"}
            </CardTitle>
            <CardDescription>
              {/* What area are you having problems with? */}
              {/* מה נושא המתאם? */}
              {props.readonly
                ? `מזהה מתאם: ${props.operator_id}`
                : props.operator_id
                ? `מזהה מתאם: ${props.operator_id}`
                : "פתיחת מתאם"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>עיר</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? ""}
                        >
                          <SelectTrigger id="area">
                            <SelectValue placeholder="בחר עיר" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem
                                key={city.city_id}
                                value={city.city_id}
                              >
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>עיר המתאם</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="location_ids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>נקודות</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              disabled={
                                props.readonly || !!locationsLoading || !cityId
                              }
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value?.length && "text-muted-foreground",
                              )}
                            >
                              {cityId && locationsLoading && (
                                <Loader2 className="me-2 h-5 w-5 animate-spin" />
                              )}
                              {field.value?.length && field.value?.length > 0
                                ? `${field.value?.length} נקודות נבחרו`
                                : "בחר נקודות"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="חפש נקודות"
                                className="h-9"
                              />
                              <ScrollArea className="h-[200px]">
                                <CommandEmpty>לא נמצאו נקודות</CommandEmpty>
                                <CommandGroup>
                                  {locations?.map((loc) => (
                                    <CommandItem
                                      key={loc.location_id}
                                      value={loc.name ?? "שם לא ידוע"}
                                      onSelect={() => {
                                        const value = field.value ?? [];
                                        const isIn = value?.includes(
                                          loc.location_id,
                                        );
                                        if (isIn) {
                                          form.setValue("location_ids", [
                                            ...value?.filter(
                                              (id) => id !== loc.location_id,
                                            ),
                                          ]);
                                          return;
                                        }
                                        form.setValue("location_ids", [
                                          ...value,
                                          loc.location_id,
                                        ]);
                                      }}
                                    >
                                      {loc.name}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value.includes(loc.location_id)
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
                      </FormControl>
                      <FormDescription>נקודות המתאם</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">שם</FormLabel>
                    <FormControl>
                      <Input
                        disabled={props.readonly}
                        id="name"
                        placeholder="שם המתאם"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>שם המתאם</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">טלפון</FormLabel>
                    <FormControl>
                      <Input
                        disabled={props.readonly}
                        id="phone"
                        placeholder="טלפון המתאם"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>טלפון המתאם</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">אימייל</FormLabel>
                    <FormControl>
                      <Input
                        disabled={props.readonly}
                        id="email"
                        placeholder="אימייל המתאם"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>אימייל המתאם </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="contact_info"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="contact_info">פרטי יצירת קשר</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={props.readonly}
                        id="contact_info"
                        placeholder="פרטי יצירת קשר"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      פרטי יצירת קשר נוספים כמו כתובת וכדומה
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
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
            <Button disabled={props.readonly ?? isLoading} type="submit">
              {isLoading && <Loader2 className="me-2 h-5 w-5 animate-spin" />}

              {!isLoading
                ? props.operator_id
                  ? "עדכן מתאם"
                  : "שלח מתאם"
                : "מעדכן..."}
            </Button>
          </CardFooter>
        </Card>
        {/* <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormDescription>
              This is your public display name.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button> */}
      </form>
    </Form>
  );
};
