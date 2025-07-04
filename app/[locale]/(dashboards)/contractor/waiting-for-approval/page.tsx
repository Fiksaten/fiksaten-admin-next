import { getaccessToken } from "@/app/lib/actions";
import {
  getContractorData,
  getCurrentContractorData,
} from "@/app/lib/services/contractorService";
import UnauthorizedContractor from "@/components/UnauthorizedContractor";

export default async function Page() {
  const accessToken = await getaccessToken();
  let contractor;
  try {
    contractor = await getCurrentContractorData(accessToken);
  } catch (error) {
    console.error(error);
    contractor = undefined;
  }
  return (
    <UnauthorizedContractor
      contractor={contractor}
      accessToken={accessToken || ""}
    />
  );
}
