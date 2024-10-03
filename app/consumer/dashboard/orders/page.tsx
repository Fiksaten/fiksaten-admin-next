import { getIdToken } from "@/app/lib/actions";
import OrdersPage from "./consumer-orders";
import { getOwnOrders } from "@/app/lib/consumerActions";

export default async function ContractorOrdersPage() {
    const idToken = await getIdToken();
    const orders = await getOwnOrders();
    return <OrdersPage orders={orders.orders} idToken={idToken} />
}
