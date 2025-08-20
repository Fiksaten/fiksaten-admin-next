import { getaccessToken } from "@/app/lib/actions";
import { getAdminAnalytics } from "@/app/lib/services/analyticsService";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const accessToken = await getaccessToken();
  const analytics = await getAdminAnalytics(accessToken);
  console.log(JSON.stringify(analytics, null, 2));
  return <AdminDashboardClient analytics={analytics} />;
}
