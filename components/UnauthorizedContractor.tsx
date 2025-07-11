"use client";

import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { CurrentContractorResponse } from "@/app/lib/types/contractorTypes";
import { requestJoinContractor } from "@/app/lib/services/contractorService";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

export default function UnauthorizedContractor({
  contractor,
  accessToken,
}: {
  contractor: CurrentContractorResponse | undefined;
  accessToken: string;
}) {
  const router = useRouter();
  const t = useTranslations("Contractor.UnauthorizedContractor");
  const [formData, setFormData] = useState({
    companyName: contractor ? contractor.contractor.name : "",
    companyEmail: contractor ? contractor.contractor.email : "",
    companyPhone: contractor ? contractor.contractor.phone : "",
    businessId: contractor ? contractor.contractor.businessId : "",
    companyDescription: contractor ? contractor.contractor.description : "",
  });
  if (!contractor) {
    return <div>No contractor data</div>;
  }
  if (contractor.contractor.approvalStatus === "approved") {
    router.replace("/contractor/dashboard");
  }

  const handleSubmit = async () => {
    const res = await requestJoinContractor(accessToken, {
      name: formData.companyName,
      description: formData.companyDescription,
      email: formData.companyEmail,
      phone: formData.companyPhone,
      businessId: formData.businessId,
    });
    if (res.message) {
      toast({
        title: t("success"),
        description: t("requestSentSuccessfully"),
      });
    } else {
      toast({
        title: t("error"),
        description: t("failedToRequestJoinContractor"),
        variant: "destructive",
      });
    }
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div>
      <h1>{t("youAreNotApprovedYet")}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">{t("companyName")}</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            name="companyName"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyEmail">{t("companyEmail")}</Label>
          <Input
            id="companyEmail"
            name="companyEmail"
            type="email"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyPhone">{t("companyPhone")}</Label>
          <Input
            id="companyPhone"
            name="companyPhone"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessId">{t("businessId")}</Label>
          <Input
            id="businessId"
            name="businessId"
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyDescription">{t("companyDescription")}</Label>
          <Textarea
            id="companyDescription"
            name="companyDescription"
            required
            onChange={handleInputChange}
          />
        </div>

        <Button type="submit" className="w-full">
          {t("updateRequest")}
        </Button>
      </form>
    </div>
  );
}
