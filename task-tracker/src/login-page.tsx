import { SignInButton } from '@clerk/clerk-react';
import { LogInIcon } from 'lucide-react';

export function LoginPage() {
  return (
    <div className='w-screen h-screen grid place-items-center'>
      <div>
        <div className='flex justify-between gap-4 cursor-pointer items-center bg-neutral-800 rounded text-sm text-white font-bold px-4 py-2 '>
          <LogInIcon />
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
