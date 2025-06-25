import { getaccessToken } from "@/app/lib/actions";
import OrdersPage from "./consumer-orders";
import { getOwnOrders } from "@/app/lib/consumerActions";

export default async function ContractorOrdersPage() {
  const accessToken = await getaccessToken();
  const orders = await getOwnOrders();
  return <OrdersPage orders={orders.orders} accessToken={accessToken} />;
}
