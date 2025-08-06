import { ContractorInterestDashboard } from "@/components/ContractorInterestDashboard";
import { getaccessToken } from "@/app/lib/actions";

export default async function ContractorInterestPage() {
  const accessToken = await getaccessToken();

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contractor Interest Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage interested contractors and send welcome emails to onboard new contractors to the platform
        </p>
      </div>
      <ContractorInterestDashboard accessToken={accessToken} />
    </div>
  );
}