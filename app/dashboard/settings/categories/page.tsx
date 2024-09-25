import { getCategories } from "@/app/lib/actions";
import { CategoryAdminComponent } from "./category-admin";

export default async function Page() {
    const categories = await getCategories()
  return (
    <CategoryAdminComponent 
      categories={categories}
    />
  );
}
