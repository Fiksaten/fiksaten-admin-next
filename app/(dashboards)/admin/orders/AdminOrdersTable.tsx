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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { updateOrder, removeOrder } from "@/app/lib/services/orderService";
import { useRouter, useSearchParams } from "next/navigation";
import type { GetAllOrdersResponses } from "@/app/lib/openapi-client";

type OrdersResponse = GetAllOrdersResponses[200];
type OrderStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "waitingForPayment"
  | "done"
  | "expired";
type OrderType = "express" | "campaign" | "normal";
type AnyOrder =
  | OrdersResponse["express"][number]
  | OrdersResponse["campaign"][number]
  | OrdersResponse["normal"][number];

interface Props {
  initialOrders: OrdersResponse;
  accessToken: string;
  currentLimit: number;
}

export default function AdminOrdersTable({
  initialOrders,
  accessToken,
  currentLimit,
}: Props) {
  const [orders, setOrders] = useState<OrdersResponse>(initialOrders);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AnyOrder | null>(null);
  const [form, setForm] = useState<{ status: OrderStatus } | { status: "" }>({
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderType>("express");

  const router = useRouter();
  const searchParams = useSearchParams();

  const openEdit = (order: AnyOrder) => {
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
      if (form.status === "") throw new Error("Please select a status");
      await updateOrder(accessToken, selectedOrder.id, {
        status: form.status as OrderStatus,
      });
      // Update the order in the appropriate array
      setOrders((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].map((o) =>
          o.id === selectedOrder.id ? { ...o, status: form.status } : o
        ),
      }));
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
      setOrders((prev) => ({
        ...prev,
        [activeTab]: prev[activeTab].filter((o) => o.id !== orderId),
      }));
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "done":
        return "bg-green-100 text-green-800";
      case "waitingForPayment":
        return "bg-purple-100 text-purple-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", newLimit.toString());
    params.set("page", "1"); // Reset to first page when changing limit
    router.push(`?${params.toString()}`);
  };

  const renderPagination = (type: OrderType) => {
    const pagination = orders.pagination[type];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
          {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
          {pagination.total} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const renderOrderTable = (orders: AnyOrder[], type: OrderType) => {
    if (!orders || orders.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No {type} orders found
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">
                {order.id.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {"categoryName" in order
                  ? (order as OrdersResponse["campaign"][number]).categoryName
                  : (
                      order as
                        | OrdersResponse["express"][number]
                        | OrdersResponse["normal"][number]
                    ).category?.name}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{order.orderStreet}</div>
                  <div className="text-gray-500">
                    {"orderCityName" in order
                      ? (order as OrdersResponse["campaign"][number])
                          .orderCityName
                      : (
                          order as
                            | OrdersResponse["express"][number]
                            | OrdersResponse["normal"][number]
                        ).city?.cityName}
                  </div>
                </div>
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(order)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(order.id)}
                    disabled={loadingId === order.id}
                  >
                    {loadingId === order.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Orders</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="limit">Items per page:</Label>
            <Select
              value={currentLimit.toString()}
              onValueChange={(value) => handleLimitChange(parseInt(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.pagination.express.total}
              </div>
              <div className="text-sm text-gray-600">Express Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.pagination.campaign.total}
              </div>
              <div className="text-sm text-gray-600">Campaign Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {orders.pagination.normal.total}
              </div>
              <div className="text-sm text-gray-600">Normal Orders</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as OrderType)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="express">
            Express Orders ({orders.pagination.express.total})
          </TabsTrigger>
          <TabsTrigger value="campaign">
            Campaign Orders ({orders.pagination.campaign.total})
          </TabsTrigger>
          <TabsTrigger value="normal">
            Normal Orders ({orders.pagination.normal.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="express" className="space-y-4">
          {renderOrderTable(orders.express, "express")}
          {renderPagination("express")}
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          {renderOrderTable(orders.campaign, "campaign")}
          {renderPagination("campaign")}
        </TabsContent>

        <TabsContent value="normal" className="space-y-4">
          {renderOrderTable(orders.normal, "normal")}
          {renderPagination("normal")}
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm({ status: value as OrderStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="waitingForPayment">
                    Waiting for Payment
                  </SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
