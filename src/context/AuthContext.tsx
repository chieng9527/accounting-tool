'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';


const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });


export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if ('code' in error) {
      const code = (error as { code?: string }).code;
      switch (code) {
        case 'auth/email-already-in-use':
          return { message: '此 Email 已被註冊' };
        case 'auth/invalid-email':
          return { message: 'Email 格式錯誤' };
        case 'auth/weak-password':
          return { message: '密碼強度不足（至少 6 位）' };
        case 'auth/wrong-password':
          return { message: '密碼錯誤' };
        case 'auth/user-not-found':
          return { message: '帳號不存在' };
        default:
          return { message: error.message };
      }
    }
    return { message: error.message };
  }
  return { message: '發生未知錯誤' };
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);