"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, MapPinIcon, EuroIcon,  FileTextIcon, ClockIcon } from "lucide-react";
import { ExtendedOrder, OfferDetails } from "@/app/lib/types";
import { fetchOfferDetails, Sort, Status } from "@/app/lib/orderActions";
import { buildApiUrl, cn } from "@/app/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

function OfferDetailsComponent({ offers }: { offers: OfferDetails[]; }) {
  if (!offers || offers.length === 0) {
    return <p className="text-black">No offers found</p>;
  }
  return (
    <div className="space-y-6 text-black p-4 rounded-lg">
      <h3 className="text-2xl font-semibold">Own sent offers</h3>
      {offers.map((offer, index) => (
        <Card key={offer.date.toString()} className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Offer {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>Date: {new Date(offer.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>
                Time: {new Date(offer.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                {new Date(offer.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex items-center">
              <EuroIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>Offer Price: {offer.offerPrice ? offer.offerPrice : "N/A"}€</span>
            </div>
            <div className="flex items-center">
              <EuroIcon className="mr-2 h-5 w-5 text-gray-500" />
              <span>Material Cost: {offer.materialCost ? offer.materialCost : "N/A"}€</span>
            </div>
            <div className="flex items-start">
              <FileTextIcon className="mr-2 h-5 w-5 text-gray-500 mt-1" />
              <span>Description: {offer.offerDescription}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OrderCard({ order, isSelected }: { order: ExtendedOrder, isSelected: boolean }) {
  return (
    <Card className={cn("mb-4", isSelected ? "bg-blue-100" : "")}>
      <CardHeader>
        <CardTitle className="text-lg text-black font-semibold">
          {order.title}
        </CardTitle>
        <CardDescription>{order.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 mb-4">
          <Badge variant="secondary">{order.categoryName}</Badge>
          <Badge variant="outline">{order.status}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              {new Date(order.startDate).toLocaleDateString()} -{" "}
              {new Date(order.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span>
              {order.orderCity}, {order.orderZip}
            </span>
          </div>
          <div className="flex items-center">
            <EuroIcon className="mr-2 h-4 w-4" />
            <span>Budget: {order.budget} €</span>
          </div>
          <div>Offers: {order.offersCount}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
}

function SendOffer({
  selectedOrder,
  onSubmit,
}: {
  selectedOrder: ExtendedOrder | null;
  onSubmit: (offer: OfferDetails, orderId: string, categoryId: string) => void;
}) {
  const [offer, setOffer] = useState<OfferDetails>({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    offerPrice: 0,
    materialCost: 0,
    offerDescription: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setOffer((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("selectedOrder", selectedOrder);
    if (!selectedOrder) {
      return;
    }
    onSubmit(offer, selectedOrder.orderId, selectedOrder.categoryId);
  };

  if (!selectedOrder) {
    return <p className="text-black">Select an order to send an offer</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          name="date"
          value={offer.date.toISOString().split("T")[0]}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            type="time"
            id="startTime"
            name="startTime"
            value={offer.startTime.toTimeString().slice(0, 5)}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            type="time"
            id="endTime"
            name="endTime"
            value={offer.endTime.toTimeString().slice(0, 5)}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="offerPrice">Offer Price (€)</Label>
        <Input
          type="number"
          id="offerPrice"
          name="offerPrice"
          value={offer.offerPrice}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="materialCost">Material Cost (€)</Label>
        <Input
          type="number"
          id="materialCost"
          name="materialCost"
          value={offer.materialCost}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="offerDescription">Offer Description</Label>
        <Textarea
          id="offerDescription"
          name="offerDescription"
          value={offer.offerDescription}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">Send Offer</Button>
    </form>
  );
}

export default function OrdersPage({ token }: { token: string }) {
  const [activeTab, setActiveTab] = useState<Status>(Status.OPEN);
  const [page, setPage] = useState(1);
  const [nameFilter, setNameFilter] = useState("");
  const [sort, setSort] = useState<Sort>("NEWEST_DATE");
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(
    null
  );
  const [offerDetails, setOfferDetails] = useState<OfferDetails[] | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const limit = 10;

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = buildApiUrl(
        `/orders/contractor/${activeTab}`,
        new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          nameFilter,
          sort,
        })
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError("Error loading orders");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, page, nameFilter, sort, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(e.target.value);
    setPage(1);
  };

  const handleSort = (value: Sort) => {
    setSort(value);
    setPage(1);
  };

  const handleOrderSelect = async (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setSelectedOrderId(order.orderId);
    if (activeTab !== Status.OPEN) {
      try {
        const details = await fetchOfferDetails(order.orderId, token);
        console.log("details", details);
        setOfferDetails(details);
      } catch (error) {
        console.error("Failed to fetch offer details:", error);
        setOfferDetails(null);
      }
    } else {
      setOfferDetails(null);
    }
  };

  const handleOfferSubmit = async (
    offer: OfferDetails,
    orderId: string,
    categoryId: string
  ) => {
    const url = buildApiUrl(`/offers`);
    const body = {
      date: offer.date,
      orderId: orderId,
      categoryId,
      startTime: offer.startTime,
      endTime: offer.endTime,
      offerDescription: offer.offerDescription,
      offerPrice: offer.offerPrice,
      materialCost: offer.materialCost,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error("Failed to submit offer");
    }
    const data = await response.json();
    console.log("Submitted offer:", data);
    fetchOrders();

    setSelectedOrder(null);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-black">Orders</h1>
      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Search by name"
          value={nameFilter}
          onChange={handleSearch}
          className="max-w-sm text-black"
        />
        <Select value={sort} onValueChange={handleSort}>
          <SelectTrigger className="w-[180px] text-black">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="text-black" value="NEWEST_DATE">
              Newest
            </SelectItem>
            <SelectItem className="text-black" value="OLDEST_DATE">
              Oldest
            </SelectItem>
            <SelectItem className="text-black" value="SMALLEST_BUDGET">
              Lowest Budget
            </SelectItem>
            <SelectItem className="text-black" value="BIGGEST_BUDGET">
              Highest Budget
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex">
        <div className="w-1/2 pr-4">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as Status)}
          >
            <TabsList className="grid w-full grid-cols-4 bg-slate-200">
              <TabsTrigger value={Status.OPEN}>Open</TabsTrigger>
              <TabsTrigger value={Status.SENT}>Sent</TabsTrigger>
              <TabsTrigger value={Status.IN_PROGRESS}>In Progress</TabsTrigger>
              <TabsTrigger value={Status.HISTORY}>History</TabsTrigger>
            </TabsList>
            {Object.values(Status).map((status) => (
              <TabsContent key={status} value={status}>
                <h2 className="text-2xl font-semibold mb-4 capitalize text-black">
                  {status} Orders
                </h2>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  {isLoading ? (
                    <p className="text-black">Loading...</p>
                  ) : error ? (
                    <p className="text-black">{error}</p>
                  ) : orders.length > 0 ? (
                    orders.map((order: ExtendedOrder) => (
                      <div
                        key={order.orderId}
                        onClick={() => handleOrderSelect(order)}
                      >
                        <OrderCard order={order} isSelected={order.orderId === selectedOrderId} />
                      </div>
                    ))
                  ) : (
                    <p className="text-black">No {status} orders found.</p>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
          <div className="mt-4 flex justify-between items-center">
            <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <div className="bg-gray-100 p-4 rounded-lg h-[calc(100vh-100px)]">
            {activeTab === Status.OPEN ? (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-black">
                  Send offer to order
                </h2>
                <SendOffer
                  selectedOrder={selectedOrder}
                  onSubmit={handleOfferSubmit}
                />
              </>
            ) : selectedOrder ? (
              offerDetails ? (
                <OfferDetailsComponent offers={offerDetails} />
              ) : (
                <p className="text-black">Loading offer details...</p>
              )
            ) : (
              <p className="text-black">Select an order to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
