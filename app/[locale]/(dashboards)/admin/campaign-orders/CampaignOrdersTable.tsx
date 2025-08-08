"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin } from "lucide-react";
import { updateCampaignOrder } from "@/app/lib/services/campaignOrderService";
import DayTimeSelection from "@/components/DayTimeSelection";

interface CampaignOrder {
  id: string;
  status: string;
  categoryName: string;
  startTime: string;
  endTime: string;
  weekdays: string[] | null;
  chosenDay: string | null;
  chosenStartTime: string | null;
  orderStreet: string | null;
  orderZip: string | null;
  orderCityName: string;
  createdAt: string;
  userId: string;
  contractorId: string | null;
}

interface Props {
  campaignOrders: CampaignOrder[];
  accessToken: string;
}

export default function CampaignOrdersTable({
  campaignOrders: initialCampaignOrders,
  accessToken,
}: Props) {
  const [campaignOrders, setCampaignOrders] = useState(initialCampaignOrders);
  const [selectedOrder, setSelectedOrder] = useState<CampaignOrder | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [showDayTimeSelection, setShowDayTimeSelection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    status: "pending" as "pending" | "accepted" | "declined" | "done",
    chosenDay: "",
    chosenStartTime: "",
    contractorId: "",
  });

  const openEdit = (order: CampaignOrder) => {
    setSelectedOrder(order);
    setForm({
      status: order.status as "pending" | "accepted" | "declined" | "done",
      chosenDay: order.chosenDay || "",
      chosenStartTime: order.chosenStartTime || "",
      contractorId: order.contractorId || "",
    });
    setOpen(true);
  };

  const openDayTimeSelection = (order: CampaignOrder) => {
    setSelectedOrder(order);
    setShowDayTimeSelection(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setShowDayTimeSelection(false);
    setSelectedOrder(null);
    setForm({
      status: "pending",
      chosenDay: "",
      chosenStartTime: "",
      contractorId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const updateData: any = { status: form.status };
      if (form.chosenDay) updateData.chosenDay = form.chosenDay;
      if (form.chosenStartTime)
        updateData.chosenStartTime = form.chosenStartTime;
      if (form.contractorId) updateData.contractorId = form.contractorId;

      await updateCampaignOrder(accessToken, selectedOrder.id, updateData);

      // Update local state
      setCampaignOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...order, ...updateData } : order
        )
      );

      toast({
        title: "Success",
        description: "Campaign order updated successfully",
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDayTimeConfirm = async (
    selectedDay: string,
    selectedTime: string
  ) => {
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const updateData = {
        status: "accepted" as const,
        chosenDay: selectedDay,
        chosenStartTime: selectedTime,
      };

      await updateCampaignOrder(accessToken, selectedOrder.id, updateData);

      // Update local state
      setCampaignOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...order, ...updateData } : order
        )
      );

      toast({
        title: "Success",
        description: "Day and time selected successfully",
      });
      closeDialog();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      accepted: { color: "bg-blue-100 text-blue-800", label: "Accepted" },
      declined: { color: "bg-red-100 text-red-800", label: "Declined" },
      done: { color: "bg-green-100 text-green-800", label: "Done" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fi-FI");
  };

  const generateAvailableDays = (weekdays: string[] | null) => {
    console.log("generateAvailableDays called with:", weekdays);

    if (!weekdays || weekdays.length === 0) {
      console.log("No weekdays provided, generating fallback days");
      // Generate next 7 days as fallback
      const days = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push(date.toISOString().split("T")[0]);
      }

      return days;
    }

    // Check if weekdays contains date strings (YYYY-MM-DD format)
    const isDateFormat = weekdays.length > 0 && weekdays[0].includes("-");

    if (isDateFormat) {
      console.log("Weekdays are in date format, using them directly");
      // If weekdays are already date strings, use them directly
      return weekdays;
    }

    // Original logic for day names
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dayNameShort = date.toLocaleDateString("en-US", {
        weekday: "short",
      });

      console.log(
        `Checking day ${i}: ${dayName} (${dayNameShort}) against weekdays:`,
        weekdays
      );

      if (weekdays.includes(dayName) || weekdays.includes(dayNameShort)) {
        days.push(date.toISOString().split("T")[0]);
      }
    }

    console.log("Generated available days:", days);
    return days;
  };

  return (
    <div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time Window</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaignOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{order.categoryName}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>
                        {order.orderStreet}, {order.orderCityName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatTime(order.startTime)} -{" "}
                        {formatTime(order.endTime)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {order.chosenDay && order.chosenStartTime ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {new Date(order.chosenDay).toLocaleDateString(
                            "fi-FI"
                          )}{" "}
                          at {formatTime(order.chosenStartTime)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(order)}
                      >
                        Edit
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => openDayTimeSelection(order)}
                        >
                          Schedule
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Campaign Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="w-full p-2 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <Label htmlFor="chosenDay">Chosen Day</Label>
              <Input
                id="chosenDay"
                type="text"
                placeholder="e.g., Monday, Tuesday"
                value={form.chosenDay}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, chosenDay: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="chosenStartTime">Chosen Start Time</Label>
              <Input
                id="chosenStartTime"
                type="time"
                value={form.chosenStartTime}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    chosenStartTime: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="contractorId">Contractor ID</Label>
              <Input
                id="contractorId"
                type="text"
                placeholder="Contractor UUID"
                value={form.contractorId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contractorId: e.target.value }))
                }
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Order"}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Day/Time Selection Dialog */}
      <Dialog
        open={showDayTimeSelection}
        onOpenChange={setShowDayTimeSelection}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Select Day and Time</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <DayTimeSelection
              availableDays={generateAvailableDays(selectedOrder.weekdays)}
              startTime={selectedOrder.startTime}
              endTime={selectedOrder.endTime}
              onConfirm={handleDayTimeConfirm}
              onCancel={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
