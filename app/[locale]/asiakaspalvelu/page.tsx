import ContactButtons from "./ContactButtons";
import MediaContact from "./MediaContact";
import ContractContact from "./ContractorContact";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  return (
    <>
      <ContactButtons locale={locale} />
      <ContractContact locale={locale} />
      <MediaContact locale={locale} />
    </>
  );
}
