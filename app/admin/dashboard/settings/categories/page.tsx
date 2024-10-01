import { createCategory, deleteCategory, getCategories } from "@/app/lib/actions";
import { CategoryAdminComponent } from "./category-admin";

export default async function Page() {
    const categories = await getCategories()

  return (
    <CategoryAdminComponent 
      categories={categories}
      onSubmit={createCategory}
      onDelete={deleteCategory}
    />

  );
}
