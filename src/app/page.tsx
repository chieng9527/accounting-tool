'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Loading from '@/components/Loading';
import LoginStatus from '@/components/LoginStatus';


function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: '發生未知錯誤' };
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [loginErrorMessage, setLoginErrorMessage] = useState('');
  const [registerErrorMessage, setRegisterErrorMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      if (auth.currentUser && !auth.currentUser.displayName && userName) {
        await updateProfile(auth.currentUser, { displayName: userName });
      }
    } catch (error: unknown) {
      const { message } = getErrorMessage(error);
      setLoginErrorMessage(message);
      setTimeout(() => {
        setLoginErrorMessage('');
      }, 3000);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerEmail, registerPassword);
      const user = userCredential.user;
      await updateProfile(user, { displayName: userName });
      await signOut(auth);
      setLoginEmail(registerEmail);
      setRegisterEmail('');
      setRegisterPassword('');
      setUserName('');
      setRegisterErrorMessage('');
    } catch (error) {
      const { message } = getErrorMessage(error);
      setRegisterErrorMessage(message);
      setTimeout(() => {
        setRegisterErrorMessage('');
      }, 3000);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-100">
      <h1 className="text-2xl font-bold my-6">React 練習用專案</h1>

      {!loading && user && !isRegistering && (
        <LoginStatus user={user} />
      )}

      {!loading && !user && (
        <>
          <LoginForm
            loginEmail={loginEmail}
            loginPassword={loginPassword}
            setLoginEmail={setLoginEmail}
            setLoginPassword={setLoginPassword}
            onLogin={handleLogin}
            errorMessage={loginErrorMessage}
          />
          <RegisterForm
            registerEmail={registerEmail}
            registerPassword={registerPassword}
            setRegisterEmail={setRegisterEmail}
            setRegisterPassword={setRegisterPassword}
            userName={userName}
            setUserName={setUserName}
            onRegister={handleRegister}
            errorMessage={registerErrorMessage}
          />
        </>
      )}
    </main>
  );
}