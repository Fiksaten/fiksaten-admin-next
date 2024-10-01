import { getIdToken,} from "@/app/lib/actions";
import ConsumerSettings from "./ConsumerSettings";

export default async function ContractorSettingsPage() {
    
    const idToken = await getIdToken();
    
    return (
        <>
            <ConsumerSettings idToken={idToken} />
        </>
    )
}

