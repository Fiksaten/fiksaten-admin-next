import { getaccessToken } from "@/app/lib/actions";
import CampaignOrdersClientComponent from "./CampaignOrdersClientComponent";
import { getAllCampaignOrders } from "@/app/lib/services/campaignOrderService";

export default async function CampaignOrdersPage() {
  const accessToken = await getaccessToken();
  const campaignOrders = await getAllCampaignOrders(accessToken);

  return (
    <CampaignOrdersClientComponent
      campaignOrders={campaignOrders}
      accessToken={accessToken}
    />
  );
}
