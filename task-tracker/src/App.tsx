import { LoginPage } from '@/login-page';
import { MainPage } from '@/main-page';
import { useSession } from '@clerk/clerk-react';

export default function App() {
  const { session } = useSession();

  if (session) {
    return <MainPage />;
  }

  return <LoginPage />;
}
