import { getaccessToken } from "@/app/lib/actions";
import OrdersPage from "./OrdersPage";

export default async function ContractorOrdersPage() {
  const token = await getaccessToken();
  return <OrdersPage token={token} />;
}
