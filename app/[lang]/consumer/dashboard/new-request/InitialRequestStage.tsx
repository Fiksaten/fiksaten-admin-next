"use client";

import { OrderDetails } from "@/app/lib/types";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { buildApiUrl } from "@/app/lib/utils";
import { Dictionary } from "@/lib/dictionaries";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ScheduleOption } from "./Details";
import { OrderFormData } from "./new-request-form";
import { Trash } from "lucide-react";
import HeadBox from "./HeadBox";

type OrderDetailsWithCategoryImage = OrderDetails & {
  categoryImageUrl: string;
  orderUpdatedAt: string;
  draftStage?: number;
};

const DraftItem: React.FC<{
  order: OrderDetailsWithCategoryImage;
  handleDraftClick: (order: OrderDetailsWithCategoryImage) => void;
  idToken: string;
  setDrafts: (drafts: OrderDetailsWithCategoryImage[]) => void;
}> = ({ order, handleDraftClick, idToken, setDrafts }) => {
  const handleRemove = async (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    const response = await fetch(buildApiUrl("/orders/my/drafts"), {
      method: "POST",
      body: JSON.stringify({ orderId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Order deleted", result);
      setDrafts(result.draftOrders);
    } else {
      console.error("Failed to delete order");
    }
  };

  const truncate = (text: string, maxLength: number) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => handleDraftClick(order)}
    >
      <div className="flex flex-col sm:flex-row p-4 gap-4">
        <Image
          src={order.categoryImageUrl}
          alt="Draft Image"
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg mb-1">
                {truncate(order.title || "Ei otsikkoa", 20)}
              </h3>
              <p className="text-sm text-gray-600">
                {truncate(order.description || "Ei kuvausta", 50)}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={(e) => handleRemove(e, order.orderId)}
              >
                <Trash size={16} />
              </Button>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Luonnos
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {order.orderUpdatedAt
              ? `Päivitetty ${format(order.orderUpdatedAt.toString(), "dd.MM.yyyy")}`
              : null}
          </p>
        </div>
      </div>
    </div>
  );
};

const InitialRequestStage: React.FC<{
  dict: Dictionary;
  goToStep: (step: number) => void;
  idToken: string;
  setFormData: (formData: OrderFormData) => void;
}> = ({ dict, goToStep, idToken, setFormData }) => {
  const [drafts, setDrafts] = useState<OrderDetailsWithCategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(dict.lander.callToActionDownload);
  const fetchDrafts = useCallback(async () => {
    console.log("Fetching drafts...");
    try {
      setLoading(true);
      const url = buildApiUrl("/orders/my/drafts");
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await response.json();
      console.log("Drafts", data);
      if (data.orders.length > 0) {
        setDrafts(data.orders);
      } else {
        setDrafts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleDraftClick = useCallback(
    async (order: OrderDetailsWithCategoryImage) => {
      let images: string[] = [];
      try {
        const url = buildApiUrl(`/orders/images/get/${order.orderId}`);
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        const data = await response.json();
        console.log("Order images", data);
        images = data.images.map(
          (image: { imageUrl: string }) => image.imageUrl
        );
        console.log("Order images", images);
      } catch (error) {
        console.log(error);
      }
      setFormData({
        orderId: order.orderId,
        categoryId: order.categoryId,
        title: order.title || "",
        description: order.description || "",
        startDate: order.startDate ? new Date(order.startDate) : undefined,
        endDate: order.endDate ? new Date(order.endDate) : undefined,
        scheduleOption:
          (order.scheduleOption as ScheduleOption) ||
          ScheduleOption.AsSoonAsPossible,
        budget: order.budget?.toString() || "",
        orderStreet: order.orderStreet || "",
        orderCity: order.orderCity || "",
        orderZip: order.orderZip || "",
        locationMoreInfo: order.locationMoreInfo || "",
        images: null,
        fetchedImages: images.length > 0 ? images : null,
        paymentMethod: (order.paymentMethod as "later" | "now") || "later",
      });

      const nextStep = order.draftStage ? order.draftStage : 2;
      goToStep(nextStep);
    },
    [goToStep, idToken, setFormData]
  );

  if (loading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeadBox
        dict={dict}
        title="Luonnokset"
        description="Viimeistele luonnos ja ilmoita avuntarve."
        imageName="woman-phone-lander"
        callToAction="Ilmoita avuntarve"
        callToActionHref="/consumer/dashboard/new-request?step=1"
      />
      <ul className="space-y-4 mt-8">
        {drafts.map((item) => (
          <li key={item.orderId.toString()}>
            <DraftItem
              order={item}
              handleDraftClick={handleDraftClick}
              idToken={idToken}
              setDrafts={setDrafts}
            />
          </li>
        ))}
      </ul>
      {drafts.length === 0 && (
        <p className="text-center text-gray-500 py-8">No drafts available.</p>
      )}
    </div>
  );
};

export default InitialRequestStage;
