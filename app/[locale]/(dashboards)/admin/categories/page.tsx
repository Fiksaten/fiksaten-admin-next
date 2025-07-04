import { getCategories } from "@/app/lib/services/categoryService";
import CategoryAdminTable from "./CategoryAdminTable";

export default async function CategoriesPage() {
  const categories = await getCategories();
  return <CategoryAdminTable initialCategories={categories} />;
}
