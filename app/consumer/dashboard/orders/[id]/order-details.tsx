"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarIcon,
  MapPinIcon,
  DollarSignIcon,
  ClockIcon,
  UserIcon,
  Star,
} from "lucide-react";
import { Contractor } from "@/app/lib/types";
import Image from "next/image";
import { buildApiUrl } from "@/app/lib/utils";
type OrderDetails = {
  orderId: string;
  userId: string;
  contractorId: string;
  categoryId: string;
  title: string;
  description: string;
  budget: string;
  status: string;
  orderStreet: string;
  orderCity: string;
  orderZip: string;
  locationMoreInfo: string;
  scheduleOption: string;
  paymentMethod: string;
  categoryName: string;
  startDate: Date;
  endDate: Date;
  orderCreatedAt: Date;
  orderUpdatedAt: Date;
  userFirstname: string;
  userLastname: string;
  userEmail: string;
  userAddressStreet: string;
  userAddressDetail: string;
  userAddressZip: string;
  userAddressCountry: string;
  userRole: string;
  categoryCategoryName: string;
  categoryCategoryImageUrl: string;
  categoryDescription: string;
  offers: Offer[];
};

type Offer = {
  date: string | null;
  id: string;
  created_at: string;
  updated_at: string;
  contractorId: string;
  orderId: string;
  categoryId: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  offerPrice: string | null;
  materialCost: string | null;
  offerDescription: string | null;
};

export default function OrderDetails({
  order,
  orderImages,
  contractor,
  idToken,
}: {
  order: OrderDetails;
  orderImages: string[];
  contractor?: Contractor | null;
  idToken: string;
}) {
const [acceptedOfferId, setAcceptedOfferId] = useState<string | null>(null);

  const handleAcceptOffer = async (offerId: string, contractorId: string, orderId: string) => {
    setAcceptedOfferId(offerId);
    const url = buildApiUrl(`/offers/accept`);
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        
          offerId,
          contractorId,
          orderId,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      
    });
    if (response.ok) {
      console.log(`Offer ${offerId} accepted`);
    } else {
      console.error(`Failed to accept offer ${offerId}`);
    }
  };
  console.log("order.offers", order.offers);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{order.title}</CardTitle>
          <CardDescription>Order ID: {order.orderId}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge
              variant={order.status === "pending" ? "default" : "secondary"}
            >
              {order.status}
            </Badge>
            <Badge variant="outline">{order.categoryName}</Badge>
          </div>
          <p>{order.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
              <span>Budget: ${order.budget}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>
                {format(new Date(order.startDate), "PPP")} -{" "}
                {format(new Date(order.endDate), "PPP")}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPinIcon className="h-5 w-5 text-muted-foreground" />
              <span>
                {order.orderStreet}, {order.orderCity}, {order.orderZip}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="h-5 w-5 text-muted-foreground" />
              <span>Schedule: {order.scheduleOption}</span>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <h3 className="font-semibold">Additional Information</h3>
            <p>{order.locationMoreInfo}</p>
          </div>
          <Separator />
          {contractor && (
            <div className="space-y-2">
              <h3 className="font-semibold">Contractor Information</h3>
              <div className="flex items-center space-x-2">
                <Image
                  src={contractor.contractorImageUrl}
                  alt={contractor.contractorName}
                  width={20}
                  height={20}
                />
                <UserIcon className="h-5 w-5 text-muted-foreground" />
                <span>{contractor.contractorName} </span>
              </div>
              <p>{contractor.contractorEmail}</p>
              <p>{contractor.contractorPhone}</p>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold mr-2">
                  {contractor.contractorReviewAverage}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <=
                        Math.round(
                          parseFloat(contractor.contractorReviewAverage)
                        )
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-muted-foreground">
                  ({contractor.contractorReviewCount || 0} reviews)
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Created: {format(new Date(order.orderCreatedAt), "PPP")}
            {order.orderCreatedAt !== order.orderUpdatedAt &&
              ` | Updated: ${format(new Date(order.orderUpdatedAt), "PPP")}`}
          </p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderImages.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Order Image ${index}`}
                width={300}
                height={300}
                className="object-cover"
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Offers</CardTitle>
          <CardDescription>
            Review and accept offers for this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {order?.offers?.length === 0 ? (
              <p className="text-center text-black">No offers yet</p>
            ) : (
              order?.offers?.map((offer) => (
                <Card key={offer.id} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Offer from Contractor {offer.contractorId}
                    </CardTitle>
                    <CardDescription>
                      Created: {format(new Date(offer.created_at), "PPP")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p>
                      <strong>Price:</strong> ${offer.offerPrice}
                    </p>
                    <p>
                      <strong>Material Cost:</strong> ${offer.materialCost}
                    </p>
                    {offer.date && (
                      <p>
                        <strong>Date:</strong>{" "}
                        {format(new Date(offer.date), "PPP")}
                      </p>
                    )}
                    {offer.startTime && offer.endTime && (
                      <p>
                        <strong>Time:</strong> {offer.startTime} -{" "}
                        {offer.endTime}
                      </p>
                    )}
                    <p>
                      <strong>Description:</strong> {offer.offerDescription}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => handleAcceptOffer(offer.id, offer.contractorId, order.orderId)}
                      disabled={
                        acceptedOfferId !== null && acceptedOfferId !== offer.id
                      }
                    >
                      {acceptedOfferId === offer.id
                        ? "Accepted"
                        : "Accept Offer"}
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
