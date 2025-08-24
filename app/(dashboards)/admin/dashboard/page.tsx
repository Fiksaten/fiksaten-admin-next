import { getaccessToken } from "@/app/lib/actions";
import { getAdminAnalytics } from "@/app/lib/services/analyticsService";
import { getAllOrders } from "@/app/lib/services/orderService";
import { getSupportTickets } from "@/app/lib/services/supportTicketService";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const accessToken = await getaccessToken();
  const analytics = await getAdminAnalytics(accessToken);
  const [ordersResponse, ticketsResponse] = await Promise.all([
    getAllOrders(accessToken, 1, 25),
    getSupportTickets(accessToken),
  ]);

  // Build a compact recent orders list across all types
  const recentOrders = [
    ...ordersResponse.express.map((o) => ({
      id: o.id,
      type: "express" as const,
      status: o.status,
      createdAt: o.createdAt,
      city: o.city?.cityName || "",
      street: o.orderStreet || "",
      category: o.category?.name || "",
    })),
    ...ordersResponse.campaign.map((o) => ({
      id: o.id,
      type: "campaign" as const,
      status: o.status,
      createdAt: o.createdAt,
      city: o.orderCityName || "",
      street: o.orderStreet || "",
      category: o.categoryName || "",
    })),
    ...ordersResponse.normal.map((o) => ({
      id: o.id,
      type: "normal" as const,
      status: o.status,
      createdAt: o.createdAt,
      city: o.city?.cityName || "",
      street: o.orderStreet || "",
      category: o.category?.name || "",
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  // Recent tickets by last activity (fallback to createdAt)
  const recentTickets = [...ticketsResponse.tickets]
    .sort(
      (a, b) =>
        new Date(b.lastActivityAt || b.createdAt).getTime() -
        new Date(a.lastActivityAt || a.createdAt).getTime()
    )
    .slice(0, 6)
    .map((t) => ({
      id: t.id,
      createdAt: t.createdAt,
      lastActivityAt: t.lastActivityAt,
      status: t.status,
      priority: t.priority ?? "normal",
      user: {
        firstname: t.user.firstname ?? "",
        lastname: t.user.lastname ?? "",
        email: t.user.email,
        role: t.user.role,
      },
      unreadCount: t.unreadCount,
      messagesCount: t.messages.length,
      content: t.content,
    }));

  return (
    <AdminDashboardClient
      analytics={analytics}
      recentOrders={recentOrders}
      recentTickets={recentTickets}
    />
  );
}
