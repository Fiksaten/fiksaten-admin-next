"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { GlobeIcon } from "@radix-ui/react-icons";

type AvailableLocale = "fi" | "en" | "sv";

const languages: Record<AvailableLocale, string> = {
  fi: "FI",
  en: "EN",
  sv: "SE",
};

export default function LanguageSelector({
  currentLang,
}: {
  currentLang: AvailableLocale;
}) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<AvailableLocale>(currentLang);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setSelectedLanguage(currentLang);
  }, [currentLang]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as AvailableLocale;
    setSelectedLanguage(newLang);
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`);
    router.push(newPathname);
  };

  return (
    <div className="flex">
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full cursor-pointer gap-1 text-black dark:text-white">
          <GlobeIcon height={20} width={20} />
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="cursor-pointer text-black dark:text-white">
            <SelectLabel>Languages</SelectLabel>
            {Object.entries(languages).map(([code, name]) => (
              <SelectItem
                key={code}
                value={code}
                className="cursor-pointer text-black dark:text-white"
              >
                <div className="flex items-center justify-between">
                  <span className="text-black dark:text-white">{name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
