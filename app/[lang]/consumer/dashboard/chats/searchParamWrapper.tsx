"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

type SearchParamsWrapperProps = {
  children: (params: {
    chatId: string | null;
    partnerId: string | null;
  }) => ReactNode;
};

export default function SearchParamsWrapper({
  children,
}: SearchParamsWrapperProps) {
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const partnerId = searchParams.get("partnerId");

  return <>{children({ chatId, partnerId })}</>;
}
