import { getOwnOrders } from "@/app/lib/services/orderService";
import { getaccessToken } from "@/app/lib/actions";
import OrderAdminTable from "./OrderAdminTable";

export default async function OrdersPage() {
  const accessToken = await getaccessToken();
  const ordersData = await getOwnOrders(accessToken);
  const orders = ordersData || [];
  return <OrderAdminTable initialOrders={orders} accessToken={accessToken} />;
}
