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
import { toast } from "@/hooks/use-toast";
import { removeOrder } from "@/app/lib/services/orderService";

interface Props {
  initialOrders: any[];
  accessToken: string;
}

export default function OrderAdminTable({ initialOrders, accessToken }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async (orderId: string) => {
    if (!confirm("Delete this order?")) return;
    setLoadingId(orderId);
    try {
      await removeOrder(accessToken, orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      toast({ title: "Order deleted" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {order.user
                  ? `${order.user.firstname || ""} ${
                      order.user.lastname || ""
                    } (${order.user.email})`
                  : "-"}
              </TableCell>
              <TableCell>
                {order.category ? order.category.name : "-"}
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.budget != null ? order.budget : "-"}</TableCell>
              <TableCell>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : ""}
              </TableCell>
              <TableCell>
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
    </div>
  );
}
