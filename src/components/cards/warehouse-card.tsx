"use client";
import {locations, warehouses} from "@/server/db/schema";
import {api} from "@/trpc/react";
import {Button} from "@ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@ui/card";
import {Input} from "@ui/input";
import {Label} from "@ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@ui/select";
import {useEffect, useState} from "react";
import {toast} from "@ui/use-toast";
import {Loader2} from "lucide-react";
import {useLocations} from "@/app/warehouses/components/locations-context";

export const WarehouseCard: React.FC<
    Partial<typeof warehouses.$inferSelect & { readonly?: boolean, location?: typeof locations.$inferSelect }>
> = (props) => {
    const client = api.useContext();
    const [allLocations, _] = useLocations();
    const updateMutation = api.warehouse.update.useMutation({
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
    const mutation = api.warehouse.createOne.useMutation({
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
    const [state, setState] = useState<Partial<typeof warehouses.$inferSelect & { location: typeof locations.$inferSelect}>>({
        ...props,
    });
    useEffect(() => {
        setState((prev) => props);
    }, [props]);
    return (
        <Card className="border-none">
            <CardHeader>
                <CardTitle>
                    {props.readonly ? "צפה במחסן" : props?.warehouse_id ? "עדכון מחסן" : "מחסן חדש"}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="name">שם</Label>
                    <Input
                        disabled={props.readonly}
                        value={state.name ?? ""}
                        onChange={(event) =>
                            setState((prev) => ({ ...prev, name: event.target.value }))
                        }
                        id="name"
                        placeholder="שם המחסן"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="location">מיקןם</Label>
                    <Select
                        disabled={props.readonly}
                        defaultValue={props.location_id ?? ""}
                        onValueChange={(value) =>
                            setState((prev) => ({ ...prev, location_id: value }))
                        }
                    >
                        <SelectTrigger id="area">
                            <SelectValue placeholder="בחר מיקום" />
                        </SelectTrigger>
                        <SelectContent>
                            {allLocations.map((location) => (
                                <SelectItem key={location.location_id} value={location.location_id}>
                                    {location?.address}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="capacity">נפח</Label>
                    <Select
                        disabled={props.readonly}
                        defaultValue={props.capacity ?? ""}
                        onValueChange={(value) =>
                            // @ts-expect-error value will be string - TS doesn't like that it's an enum type
                            setState((prev) => ({ ...prev, capacity: value }))
                        }
                    >
                        <SelectTrigger id="area">
                            <SelectValue placeholder="בחר נפח" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.capacity.enumValues.map((capacity) => (
                                <SelectItem key={capacity} value={capacity}>
                                    {capacity}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
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
                        if (state.warehouse_id) {
                            void updateMutation.mutateAsync({id: state.warehouse_id, data: state});
                        } else void mutation.mutateAsync(state);
                    }}
                >
                    {isLoading && <Loader2 className="me-2 h-5 w-5 animate-spin" />}

                    {!isLoading
                        ? !state.warehouse_id
                            ? "שמור מחסן"
                            : "עדכן מחסן"
                        : "מעדכן..."}
                </Button>
            </CardFooter>
        </Card>
    );
};
