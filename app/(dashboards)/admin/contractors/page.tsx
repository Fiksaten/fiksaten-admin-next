import { getaccessToken } from "@/app/lib/actions";
import { getAllContractorJoinRequests } from "@/app/lib/services/contractorService";
import ContractorJoinRequestsTable from "./ContractorJoinRequestsTable";

export default async function AdminContractors() {
  const accessToken = await getaccessToken();
  const contractorJoinRequests = await getAllContractorJoinRequests(
    accessToken
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contractor Join Requests</h1>
      <ContractorJoinRequestsTable
        joinRequests={contractorJoinRequests}
        accessToken={accessToken}
      />
    </div>
  );
}
