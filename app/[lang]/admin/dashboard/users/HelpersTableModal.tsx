"use client";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildApiUrl } from "@/app/lib/utils";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { ContractorResponse } from "@/app/lib/types";
import fallbackImage from "@/public/icon.png";

interface InfoItemProps {
  title: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value }) => (
  <div className="flex flex-col space-y-1">
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-sm">{value}</p>
  </div>
);

interface HelpersTableModalProps {
  item: ContractorResponse;
  idToken: string;
  setHelpersTableModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HelpersTableModal: React.FC<HelpersTableModalProps> = ({
  item,
  setHelpersTableModalOpen,
  idToken,
}) => {
  

  const handleAccept = async () => {
    const url = buildApiUrl("admin/contractor/approve");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ userId: item.userId }),
    });
    if(response.ok) {
      setHelpersTableModalOpen(false);
    } else {
        toast({
            title: "Hyväksyminen epäonnistui",
            description: "Laita viesti Jonille",
            variant: "destructive",
        });
      console.error("Failed to accept contractor");
    }
  };

  const handleDecline = async () => {
    
    const url = buildApiUrl("admin/contractor/decline");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ userId: item.userId }),
    });
    if(response.ok) {
      setHelpersTableModalOpen(false);
    } else {
        toast({
            title: "Hylkääminen epäonnistui",
            description: "Laita viesti Jonille",
            variant: "destructive",
        });
      console.error("Failed to decline contractor");
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => setHelpersTableModalOpen(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Image src={item.contractorImageUrl !== "Unknown" ? item.contractorImageUrl : fallbackImage} alt="logo" className="w-8 h-8" width={32} height={32} />
            <span>{item.contractorName}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <InfoItem title="Yritys" value={item.contractorName} />
          <InfoItem title="Y-tunnus" value={item.contractorBusinessId} />
          <InfoItem title="Sähköposti" value={item.contractorEmail} />
          <InfoItem title="Puhelinnumero" value={item.contractorPhone} />
          <InfoItem title="Nimi" value={`${item.firstname} ${item.lastname}`} />
          <InfoItem title="IBAN" value={item.contractorIban || ""} />
          <InfoItem title="Verkkosivut" value={item.contractorWebsite} />
          <InfoItem title="Profiili luotu" value={item.created_at} />
          <InfoItem title="Valittu kategoria" value={item.contractorCategoryId} />
          <InfoItem title="Tila" value={item.approvalStatus} />
          <InfoItem title="Kuvaus" value={item.contractorDescription} />
          <InfoItem title="BIC" value={item.contractorBic || ""} />
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDecline}>
            Hylkää hakemus
          </Button>
          <Button variant="outline">Lisää työlupa</Button>
          <Button onClick={handleAccept}>Hyväksy hakemus</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpersTableModal;