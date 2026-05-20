import { AuthModal } from '@/src/entities/user/ui/auth-modal';
import { getUserSession } from '@/src/features/auth/actions/get-user-session';
import { redirect } from 'next/navigation';
import { EsmetLogo } from '../shared/components/esmet-logo';

export default async function Home() {
  const user = await getUserSession();
  if (user) {
    return redirect('/dashboard');
  }
  return (
    <div className='flex min-h-screen flex-col bg-linear-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='flex grow flex-col items-center justify-center'>
        <EsmetLogo width={320} height={115} />

        <p className='text-l mb-8 max-w-xl p-2 text-center text-gray-300'></p>

        <AuthModal />
      </div>
    </div>
  );
}
