import { getaccessToken } from "@/app/lib/actions";
import { getAllAvailableAreaRequests } from "@/app/lib/services/availableAreaRequestService";
import AvailableAreaRequestsTable from "./AvailableAreaRequestsTable";

export default async function AvailableAreaRequestsPage() {
  const accessToken = await getaccessToken();
  const availableAreaRequests = await getAllAvailableAreaRequests(accessToken);
  
  return (
    <AvailableAreaRequestsTable
      availableAreaRequests={availableAreaRequests}
      accessToken={accessToken}
    />
  );
}

