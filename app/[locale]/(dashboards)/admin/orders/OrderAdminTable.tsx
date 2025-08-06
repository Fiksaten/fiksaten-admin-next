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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { updateOrder, removeOrder } from "@/app/lib/services/orderService";
import type { OwnOrderResponse } from "@/app/lib/types/orderTypes";

interface Props {
  initialOrders: OwnOrderResponse;
  accessToken: string;
}

export default function OrderAdminTable({
  initialOrders,
  accessToken,
}: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [form, setForm] = useState({ status: "" });
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const openEdit = (order: any) => {
    setSelectedOrder(order);
    setForm({ status: order.status });
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await updateOrder(accessToken, selectedOrder.id, { status: form.status });
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: form.status } : o))
      );
      toast({ title: "Order updated" });
      closeDialog();
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    setLoadingId(orderId);
    try {
      await removeOrder(accessToken, orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast({ title: "Order deleted" });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fi-FI");
  };

  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
    { value: "waitingForPayment", label: "Waiting For Payment" },
    { value: "done", label: "Done" },
    { value: "expired", label: "Expired" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.user?.email}</TableCell>
              <TableCell>{order.category?.name}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <Button size="sm" className="mr-2" onClick={() => openEdit(order)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={loadingId === order.id}
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>User</Label>
                <p>{selectedOrder.user?.email}</p>
              </div>
              <div>
                <Label>Category</Label>
                <p>{selectedOrder.category?.name}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p>{selectedOrder.description}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

