import { getaccessToken } from "@/app/lib/actions";
import ConsumerSettings from "./ConsumerSettings";

export default async function ContractorSettingsPage() {
  const accessToken = await getaccessToken();

  return (
    <>
      <ConsumerSettings accessToken={accessToken} />
    </>
  );
}
