'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface RecordItem {
  id: string;
  type: string;
  amount: number;
  description: string;
  createdAt: { seconds: number };
}

export default function RecordList() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const q = query(
      collection(userDocRef, 'records'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as RecordItem[];
      setRecords(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await deleteDoc(doc(userDocRef, 'records', id));
  };

  const total = records.reduce((sum, item) => {
    return item.type === '收入' ? sum + item.amount : sum - item.amount;
  }, 0);

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-lg mt-5">
      <h2 className="text-xl font-semibold mb-4">歷史記錄</h2>
      {records.length === 0 ? (
        <p className="text-gray-600">尚無紀錄</p>
      ) : (
        <ul className="mb-4">
          {records.map(record => (
            <li key={record.id} className="flex justify-between items-center mb-2">
              <span>
                [{record.type}] {record.description} - ${record.amount}
              </span>
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => handleDelete(record.id)}
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="font-bold mb-4">目前小計：{total} 元</p>
      <button
        className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
        onClick={() => router.push('/')}
      >
        回到首頁
      </button>
    </div>
  );
}