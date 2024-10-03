import { getLatestOrders, getOwnOrders } from "@/app/lib/consumerActions";
import { LandingPage } from "./landing-page";

export default async function Page() {
  const latestOrders = await getLatestOrders();
  const ownOrders = await getOwnOrders();
  console.log("Latest orders:", latestOrders);
  console.log("Own orders:", ownOrders);
  return (
    <LandingPage latestOrders={latestOrders} ownOrders={ownOrders.orders}/>
  );
}
