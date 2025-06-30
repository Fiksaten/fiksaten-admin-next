import { getTranslations } from "next-intl/server";

export default async function PromotionHeader({ locale }: { locale: string }) {
  const t = await getTranslations({
    locale,
    namespace: "",
  });
  return (
    <div className="bg-[#007AFF] text-white py-2">
      <p className="text-center text-sm font-bold">{t("promotionHeader")}</p>
    </div>
  );
}
