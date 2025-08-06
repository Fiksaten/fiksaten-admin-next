import { getaccessToken } from "@/app/lib/actions";
import { getOwnOrders } from "@/app/lib/services/orderService";
import OrderAdminTable from "./OrderAdminTable";

export default async function OrdersPage() {
  const accessToken = await getaccessToken();
  const orders = await getOwnOrders(accessToken);
  return (
    <OrderAdminTable initialOrders={orders} accessToken={accessToken} />
  );
}
