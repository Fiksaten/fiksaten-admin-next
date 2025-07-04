import { getaccessToken } from "@/app/lib/actions";
import { getLandingPageAnalytics } from "@/app/lib/services/analyticsService";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const accessToken = await getaccessToken();
  const analytics = await getLandingPageAnalytics(accessToken);
  console.log("analytics", JSON.stringify(analytics));
  return <AdminDashboardClient analytics={analytics} />;
}
