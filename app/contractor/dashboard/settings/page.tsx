import { getCategories, getContractorCategories, getContractorData, getIdToken } from "@/app/lib/actions";
import ContractorSettings from "./ContractorSettings";
import CategoryPicker from "./CategoryPicker";
import { CategoryData } from "@/app/lib/types";

export default async function ContractorSettingsPage() {
    
    const idToken = await getIdToken();
    const contractorData = await getContractorData(idToken);
    console.log("Contractor data:", contractorData);
    const extractIds = (data: CategoryData[]): string[] => data.map((item) => item.categories.id);
    const contractorCategories = await getContractorCategories();
    const categories = await getCategories();
    const selectedCategoryIds = extractIds(contractorCategories);
    return (
        <>
            <ContractorSettings idToken={idToken} contractorData={contractorData}/>
            <CategoryPicker categories={categories} selectedCategoryIds={selectedCategoryIds} idToken={idToken} />
        </>
    )
}

