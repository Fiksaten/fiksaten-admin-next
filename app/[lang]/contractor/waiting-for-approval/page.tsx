import { getContractorData, getIdToken } from "@/app/lib/actions"
import UnauthorizedContractor from "@/components/UnauthorizedContractor"

export default async function Page(){
    const idToken = await getIdToken()
    let contractor
    try {
        contractor = await getContractorData(idToken)
    } catch {
        contractor = undefined
    }
    return <UnauthorizedContractor contractor={contractor} />
}