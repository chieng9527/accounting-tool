'use client';

import { useRouter } from 'next/navigation';
import { signOut, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginStatus({ user }: { user: User }) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-4">歡迎登入</h2>
      <p className="mb-4 break-words">
        {user.displayName}，您已經使用 <br /> <span className="font-medium">{user.email}</span> 登入。
      </p>
      <div className="flex gap-2">
        <button
          className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => router.push('/accounting')}
        >
          立即開始
        </button>
        <button
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          登出
        </button>
      </div>
    </div>
  );
}