import { getIdToken } from "@/app/lib/actions";
import Navigation from "@/components/lander/Navigation";
import LiveChatWidget from "@/components/LiveChatWidget";
import { AvailableLocale, getDictionary } from "@/lib/dictionaries";

export default async function ConsumerDashboard(
  props: Readonly<{
    children: React.ReactNode;
    params: { lang: AvailableLocale };
  }>
) {
  const params = await props.params;

  const {
    lang
  } = params;

  const {
    children
  } = props;

  const dict = await getDictionary(lang);
  const idToken = await getIdToken();
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <Navigation dict={dict} />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <LiveChatWidget idToken={idToken!} />
          {children}
        </main>
      </div>
    </div>
  );
}
