"use client";

import CampaignOrdersTable from "./CampaignOrdersTable";
import type { GetAllCampaignOrdersResponses } from "@/app/lib/openapi-client";

interface Props {
  campaignOrders: GetAllCampaignOrdersResponses[200];
  accessToken: string;
}

export default function CampaignOrdersClientComponent({
  campaignOrders,
  accessToken,
}: Props) {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Campaign Orders</h1>
        <p className="text-gray-600 mt-2">
          Manage campaign orders and assign contractors
        </p>
      </div>
      <CampaignOrdersTable
        campaignOrders={campaignOrders}
        accessToken={accessToken}
      />
    </div>
  );
}
