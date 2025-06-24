import { getDictionary, AvailableLocale } from "@/lib/dictionaries";
import LinkPayments from "./LinkPayments";

export default async function LinkPaymentsPage({
  params,
}: {
  params: Promise<{ lang: AvailableLocale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <LinkPayments dict={dict} />;
}
