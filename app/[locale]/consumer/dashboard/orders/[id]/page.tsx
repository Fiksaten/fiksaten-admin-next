import { getOrderById } from "@/app/lib/consumerActions";
import OrderComponent from "./order-details";
import { getContractorById, getaccessToken } from "@/app/lib/actions";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const accessToken = await getaccessToken();
  const order = await getOrderById(params.id as string);
  console.log("order", order.order.offers);
  console.log("order contractorId", order.order.contractorId);
  let contractor = null;
  if (order.order.contractorId) {
    contractor = await getContractorById(order.order.contractorId as string);
    console.log("contractor", contractor);
  }

  return (
    <div>
      <OrderComponent
        order={order.order}
        orderImages={order.orderImages}
        contractor={contractor}
        accessToken={accessToken}
      />
    </div>
  );
}
