"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/app/lib/utils";
import { Category } from "@/app/lib/types";
import ChooseCategory from "./ChooseCategory";
import { Dictionary } from "@/lib/dictionaries";
import Details from "./Details";
import BudgetAndImages from "./BudgetAndImages";
import AddressAndPayment from "./AddressAndPayment";
import ReviewAndSubmit from "./ReviewAndSubmit";
import InitialRequestStage from "./InitialRequestStage";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export enum ScheduleOption {
  AsSoonAsPossible = "ASAP",
  Today = "TODAY",
  Tomorrow = "TOMORROW",
  Flexible = "FLEXIBLE",
  inTwoWeeks = "IN_TWO_WEEKS",
}

export type OrderFormData = {
  orderId: string;
  categoryId: string;
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  scheduleOption: ScheduleOption;
  budget: string;
  images: FileList | null;
  orderStreet: string;
  orderCity: string;
  orderZip: string;
  locationMoreInfo: string;
  paymentMethod: "later" | "now";
  fetchedImages: string[] | null;
}

const NewRequestFormComponent: React.FC<{
  idToken: string;
  categories: Category[];
  dict: Dictionary;
}> = ({ idToken, categories, dict }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log("params", searchParams);
  const step = searchParams.get("step") ? parseInt(searchParams.get("step") as string, 10) : 0;
  
  const [formData, setFormData] = useState<OrderFormData>({
    orderId: '',
    categoryId: '',
    title: '',
    description: '',
    startDate: undefined,
    endDate: undefined,
    scheduleOption: ScheduleOption.AsSoonAsPossible,
    budget: '',
    orderStreet: '',
    orderCity: '',
    orderZip: '',
    images: null,
    locationMoreInfo: '',
    paymentMethod: 'later' as 'later' | 'now',
    fetchedImages: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (categoryId: string) => {
    setFormData(prev => ({ ...prev, categoryId }));
  };

  const handleDateChange = (
    date: Date ,
    field: "startDate" | "endDate"
  ) => {
    setFormData(prev => ({ ...prev, [field]: date?.toISOString() || '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files);
    //TODO: Handle file change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = buildApiUrl("/orders/create");
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          isDraft: false,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (response.ok) {
        const result = await response.json();
        console.log("Order created", result);
      } else {
        console.error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order", error);
    }
  };

  const sendDraftData = (newStep: number) => {
    console.log("Sending draft data to backend", newStep);
  };

  const goToStep = (newStep: number) => {
    sendDraftData(newStep);
    router.push(`/consumer/dashboard/new-request?step=${newStep}`);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <InitialRequestStage
            dict={dict}
            goToStep={goToStep}
            idToken={idToken}
            setFormData={setFormData}
          />
        );
      case 1:
        return (
          <ChooseCategory
            dict={dict}
            categories={categories}
            handleCategoryClick={handleCategoryClick}
            setStep={goToStep}
            step={step}
          />
        );
      case 2:
        return (
          <Details
            dict={dict}
            formData={formData}
            handleInputChange={handleInputChange}
            handleDateChange={(date: Date, name: "startDate" | "endDate") => handleDateChange(date, name)}
          />
        );
      case 3:
        return (
          <BudgetAndImages
            dict={dict}
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
          />
        );
      case 4:
        return (
          <AddressAndPayment
            dict={dict}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return <ReviewAndSubmit dict={dict} formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 px-48 mx-auto">
      {renderStep()}
      <div className="flex justify-between">
        {step > 0 && (
          <Button
            variant="outline"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold"
            type="button"
            onClick={() => goToStep(step - 1)}
          >
            Previous
          </Button>
        )}
        {step < 5 && step !== 0 && (
          <Button
            variant="default"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold"
            type="button"
            onClick={() => goToStep(step + 1)}
          >
            Seuraava
          </Button>
        )}
      </div>
    </form>
  );
};

export default NewRequestFormComponent;