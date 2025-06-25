import {
  getCategories,
  getContractorCategories,
  getContractorData,
  getaccessToken,
} from "@/app/lib/actions";
import ContractorSettings from "./ContractorSettings";
import CategoryPicker from "./CategoryPicker";
import { CategoryData } from "@/app/lib/types";

export default async function ContractorSettingsPage() {
  const accessToken = await getaccessToken();
  const contractorData = await getContractorData(accessToken);
  console.log("Contractor data:", contractorData);
  const extractIds = (data: CategoryData[]): string[] =>
    data.map((item) => item.categories.id);
  const contractorCategories = await getContractorCategories();
  const categories = await getCategories();
  const selectedCategoryIds = extractIds(contractorCategories);
  return (
    <>
      <ContractorSettings
        accessToken={accessToken}
        contractorData={contractorData}
      />
      <CategoryPicker
        categories={categories}
        selectedCategoryIds={selectedCategoryIds}
        accessToken={accessToken}
      />
    </>
  );
}
