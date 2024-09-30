import { getOrderById } from "@/app/lib/consumerActions";  
import ReviewComponent from "./review-component";
import { getContractorById, getIdToken } from "@/app/lib/actions";

export default async function Page({
    params,
    searchParams,
  }: {
    params: { id: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    const idToken = await getIdToken();
    const order = await getOrderById(params.id as string);
    const contractor = await getContractorById(order.order.contractorId as string);

    return (
        <div>
            <ReviewComponent order={order.order} orderImages={order.orderImages} contractor={contractor} idToken={idToken}  />
        </div>
    );
}
