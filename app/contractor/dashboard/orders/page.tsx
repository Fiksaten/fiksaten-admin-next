import { getIdToken } from "@/app/lib/actions";
import OrdersPage from "./OrdersPage";

export default async function ContractorOrdersPage() {
    const token = await getIdToken();
    return <OrdersPage token={token} />
}
