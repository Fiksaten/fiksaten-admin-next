import { getaccessToken } from "@/app/lib/actions";
import { getCategories } from "@/app/lib/services/categoryService";
import CategoryAdminTable from "./CategoryAdminTable";

export default async function CategoriesPage() {
  const accessToken = await getaccessToken();
  const categories = await getCategories(accessToken);
  return (
    <CategoryAdminTable
      initialCategories={categories}
      accessToken={accessToken}
    />
  );
}
