import { getaccessToken } from "@/app/lib/actions";
import { getAllContractorJoinRequests, getAllContractors } from "@/app/lib/services/contractorService";
import ContractorJoinRequestsTable from "./ContractorJoinRequestsTable";
import ContractorsTable from "./ContractorsTable";

export default async function AdminContractors() {
  const accessToken = await getaccessToken();
  const [contractorJoinRequests, contractors] = await Promise.all([
    getAllContractorJoinRequests(accessToken),
    getAllContractors(accessToken),
  ]);

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Contractors</h1>
        <ContractorsTable initialContractors={contractors} />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">Contractor Join Requests</h2>
        <ContractorJoinRequestsTable
          joinRequests={contractorJoinRequests}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
