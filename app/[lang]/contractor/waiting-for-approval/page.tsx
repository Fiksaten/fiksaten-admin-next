import { getContractorData, getaccessToken } from "@/app/lib/actions";
import UnauthorizedContractor from "@/components/UnauthorizedContractor";

export default async function Page() {
  const accessToken = await getaccessToken();
  let contractor;
  try {
    contractor = await getContractorData(accessToken);
  } catch {
    contractor = undefined;
  }
  return <UnauthorizedContractor contractor={contractor} />;
}
