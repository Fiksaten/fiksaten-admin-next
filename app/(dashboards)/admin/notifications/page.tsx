import NotificationsInsightsClient from "@/app/(dashboards)/admin/notifications/ui/NotificationsInsightsClient";
import { getaccessToken } from "@/app/lib/actions";
import { getNotificationsInsights } from "@/app/lib/services/notificationService";

export default async function AdminNotificationsInsightsPage() {
  const token = await getaccessToken();
  const insights = await getNotificationsInsights(token ?? undefined);
  return <NotificationsInsightsClient insights={insights} />;
}

