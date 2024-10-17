import { getCategories, getIdToken } from "@/app/lib/actions";
import NewRequestForm from "./new-request-form";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

export default async function NewRequest({
  params,
}: {
  params: { lang: string };
}) {
  const idToken = await getIdToken();
  const categories = await getCategories();
  const dict = await getDictionary((params.lang as AvailableLocale) || "fi");

  return (
    <div className="text-black overflow-y-hidden">
      <NewRequestForm idToken={idToken} categories={categories} dict={dict} />
    </div>
  );
}


