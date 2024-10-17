'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, usePathname } from 'next/navigation'

type AvailableLocale = 'fi' | 'en' | 'sv'

const languages: Record<AvailableLocale, string> = {
  fi: '🇫🇮 Suomi',
  en: '🇬🇧 English',
  sv: '🇸🇪 Svenska'
}

export default function LanguageSelector({ currentLang }: { currentLang: AvailableLocale }) {
  const [selectedLanguage, setSelectedLanguage] = useState<AvailableLocale>(currentLang)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setSelectedLanguage(currentLang)
  }, [currentLang])

  const handleLanguageChange = (value: string) => {
    const newLang = value as AvailableLocale
    setSelectedLanguage(newLang)
    const newPathname = pathname.replace(`/${currentLang}`, `/${newLang}`)
    console.log(`New pathname: ${newPathname}`)
    router.push(newPathname)
    console.log(`Language changed to: ${value}`)
  }

  return (
    <div className="flex">
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full cursor-pointer text-black">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="cursor-pointer text-black">
            <SelectLabel>Languages</SelectLabel>
            {Object.entries(languages).map(([code, name]) => (
              <SelectItem key={code} value={code} className="cursor-pointer text-black">
                <div className="flex items-center justify-between">
                  <span className="text-black">{name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}