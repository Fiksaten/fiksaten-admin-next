import { getCategories, getaccessToken } from "@/app/lib/actions";
import NewRequestForm from "./new-request-form";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

export default async function NewRequest(props: {
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const accessToken = await getaccessToken();
  const categories = await getCategories();
  const dict = await getDictionary((params.lang as AvailableLocale) || "fi");

  return (
    <div className="text-black overflow-y-hidden">
      <NewRequestForm
        accessToken={accessToken}
        categories={categories}
        dict={dict}
      />
    </div>
  );
}
