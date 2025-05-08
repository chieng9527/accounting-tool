'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, push } from 'firebase/database';
import { rtdb, auth } from '@/lib/firebase';

interface Notice {
  user: string;
  message: string;
  timestamp: number;
}

export default function RealtimeNotice() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const noticeRef = ref(rtdb, 'notices');
    const unsubscribe = onValue(noticeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.values(data) as Notice[];
        const sorted = items
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 6);
        setNotices(sorted);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleUpdate = () => {
    if (!input.trim()) return;
    const noticeRef = ref(rtdb, 'notices');
    const newNotice: Notice = {
      user: auth.currentUser?.displayName || auth.currentUser?.email || '匿名使用者',
      message: input,
      timestamp: Date.now(),
    };
    push(noticeRef, newNotice);
    setInput('');
  };

  return (
    <div className="bg-white   p-4 rounded shadow max-w-lg w-full my-5">
      <p className="font-bold mb-2">📢 即時公告</p>

      <div className="mb-4 space-y-1 max-h-60 overflow-y-auto">
        {notices.map((n, i) => (
          <div key={i} className="text-sm text-gray-800">
            <span className="font-semibold">{n.user}：</span>
            {n.message}
            <span className="text-gray-500 text-xs ml-2">
              ({new Date(n.timestamp).toLocaleString()})
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入新公告內容"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleUpdate}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          發佈
        </button>
      </div>
    </div>
  );
}