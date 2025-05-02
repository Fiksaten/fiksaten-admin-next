import { Dictionary } from "@/lib/dictionaries";

export default function PromotionHeader({dict}: {dict: Dictionary}) {
  return (
    <div className="bg-[#007AFF] text-white py-2">
      <p className="text-center text-sm font-bold">
        {dict.promotionHeader}
      </p>
    </div>
  )
}
