import { getContractorData, getIdToken, getUser } from "@/app/lib/actions";
import ContractorSettings from "./ContractorSettings";

export default async function ContractorSettingsPage() {
    
    const idToken = await getIdToken();
    const contractorData = await getContractorData(idToken);
    console.log("Contractor data:", contractorData);
    return (
        <ContractorSettings idToken={idToken} contractorData={contractorData}/>
    )
}

