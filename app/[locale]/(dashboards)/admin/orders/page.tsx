import { getaccessToken } from "@/app/lib/actions";
import { getAllOrders } from "@/app/lib/services/orderService";
import AdminOrdersTable from "./AdminOrdersTable";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const accessToken = await getaccessToken();
  const { page, limit } = await searchParams;
  const pageNumber = parseInt(page || "1");
  const limitNumber = parseInt(limit || "20");

  const orders = await getAllOrders(accessToken, pageNumber, limitNumber);

  return (
    <AdminOrdersTable
      initialOrders={orders}
      accessToken={accessToken}
      currentLimit={limitNumber}
    />
  );
}
