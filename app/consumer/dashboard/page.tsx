import { getLatestOrders, getOwnOrders } from "@/app/lib/consumerActions";
import { LandingPage } from "@/components/landing-page";

export default async function Page() {
  const latestOrders = await getLatestOrders();
  const ownOrders = await getOwnOrders();
  return (
    <LandingPage latestOrders={latestOrders} ownOrders={ownOrders}/>
  );
}
