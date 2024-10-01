import OrdersPage from "./consumer-orders";
import { getOwnOrders } from "@/app/lib/consumerActions";

export default async function ContractorOrdersPage() {
    const orders = await getOwnOrders();
    return <OrdersPage orders={orders.orders} />
}
