import { getaccessToken } from "@/app/lib/actions";
import CustomerServiceChat from "./CustomerServiceChat";

export default async function CustomerServicePage() {
  const accessToken = await getaccessToken();
  return <CustomerServiceChat accessToken={accessToken} />;
}
