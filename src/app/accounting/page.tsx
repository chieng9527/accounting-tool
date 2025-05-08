'use client';

import AccountForm from '@/components/AccountForm';
import RecordList from '@/components/RecordList';
import RealtimeNotice from '@/components/RealtimeNotice';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';


export default function AccountingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/');
    }
  }, [user, loading]);

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <RealtimeNotice />
      <AccountForm />
      <RecordList />
    </main>
  );
}