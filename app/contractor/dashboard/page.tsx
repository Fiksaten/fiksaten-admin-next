import { getContractorReports } from "@/app/lib/actions";
import ContractorMetricsDashboard from "@/components/contractor-reports-page";

export default async function Home() {
  const reports = await getContractorReports();
  return (
    <ContractorMetricsDashboard metrics={reports}/>
  );
}
