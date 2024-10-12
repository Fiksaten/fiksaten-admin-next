import { getIdToken } from '@/app/lib/actions';
import CustomerServiceChat from './CustomerServiceChat';

export default async function CustomerServicePage() {
  const idToken = await getIdToken();
  return (
      <CustomerServiceChat idToken={idToken} />
  );
}