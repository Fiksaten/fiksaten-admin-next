import { ReportsPage } from "@/components/reports-page";
import { getReports } from "@/app/lib/actions";
export default async function Home() {
  const reports = await getReports();
  return (
    <ReportsPage reports={reports}/>
  );
}
