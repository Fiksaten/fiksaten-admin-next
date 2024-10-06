import { AvailableLocale, getDictionary } from "./dictionaries";

export default async function Home({ params: { lang } }: { params: { lang: string } }) {
    const dict = await getDictionary(lang as AvailableLocale);
    return (
        <div>
            <h1>{dict.greeting}</h1>
        </div>
    )
}