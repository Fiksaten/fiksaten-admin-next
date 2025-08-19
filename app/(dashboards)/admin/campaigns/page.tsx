import { getaccessToken } from "@/app/lib/actions";
import CampaignClientComponent from "./CampaignClientComponent";
import { getAllCampaigns } from "@/app/lib/services/campaignService";

export default async function CampaignsPage() {
  const accessToken = await getaccessToken();
  const campaigns = await getAllCampaigns(accessToken);

  return (
    <CampaignClientComponent campaigns={campaigns} accessToken={accessToken} />
  );
}
