import { getaccessToken } from "@/app/lib/actions";
import { getCategories } from "@/app/lib/services/categoryService";
import { getCities } from "@/app/lib/services/cityCategoryService";
import CityCategoriesTable from "./CityCategoriesTable";

export default async function CityCategoriesPage() {
  const accessToken = await getaccessToken();
  const [categories, cities] = await Promise.all([
    getCategories(accessToken),
    getCities(accessToken),
  ]);
  
  return (
    <CityCategoriesTable
      initialCategories={categories}
      initialCities={cities}
      accessToken={accessToken}
    />
  );
}

