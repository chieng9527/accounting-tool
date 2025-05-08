'use client';

import { useState } from 'react';
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function AccountForm() {
  const [type, setType] = useState('收入');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const handleAdd = async () => {
    if (!user || !amount || !description) return;

    const userDocRef = doc(db, 'users', user.uid);
    await addDoc(collection(userDocRef, 'records'), {
      type,
      amount: Number(amount),
      description,
      user: user.uid,
      createdAt: serverTimestamp()
    });

    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4">新增記錄</h2>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded w-full sm:w-auto">
          <option value="收入">收入</option>
          <option value="支出">支出</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="金額"
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="內容"
          className="border p-2 rounded flex-1 w-full sm:w-auto"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600 w-full sm:w-auto"
        >
          新增
        </button>
      </div>
    </div>
  );
}
