import { getOrderById } from "@/app/lib/consumerActions";  
import ReviewComponent from "./review-component";
import { getContractorById, getIdToken } from "@/app/lib/actions";

export default async function Page(
    props: {
        params: Promise<{ id: string }>;
      }
) {
    const params = await props.params;
    const idToken = await getIdToken();
    const order = await getOrderById(params.id as string);
    const contractor = await getContractorById(order.order.contractorId as string);

    return (
        <div>
            <ReviewComponent order={order.order} contractor={contractor} idToken={idToken}  />
        </div>
    );
}
