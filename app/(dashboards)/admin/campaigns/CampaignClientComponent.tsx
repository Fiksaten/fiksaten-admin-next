import { GetAllCampaignsResponses } from "@/app/lib/openapi-client";
import CampaignAdminTable from "./CampaignAdminTable";

export default function CampaignClientComponent({
  campaigns,
  accessToken,
}: {
  campaigns: GetAllCampaignsResponses[200];
  accessToken: string;
}) {
  return <CampaignAdminTable campaigns={campaigns} accessToken={accessToken} />;
}
