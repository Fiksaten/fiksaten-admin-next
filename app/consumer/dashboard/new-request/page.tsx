import { getCategories, getIdToken } from "@/app/lib/actions";
import NewRequestForm from "./new-request-form";

export default async function NewRequest() {
    const idToken = await getIdToken()
    const categories = await getCategories()
    return( 
    <div className="text-black overflow-y-hidden">
        <NewRequestForm idToken={idToken} categories={categories} />
    </div>
    )
}