'use client';

interface RegisterFormProps {
  registerEmail: string;
  registerPassword: string;
  setRegisterEmail: (email: string) => void;
  setRegisterPassword: (password: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  onRegister: (setErrorMessage: (msg: string) => void) => Promise<void>;
  errorMessage?: string;
}

export default function RegisterForm({
  registerEmail,
  registerPassword,
  setRegisterEmail,
  setRegisterPassword,
  userName,
  setUserName,
  onRegister,
  errorMessage,
}: RegisterFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(() => { });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm mt-6">
      <h2 className="text-xl font-semibold mb-4">註冊</h2>
      {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
      <input
        type="text"
        placeholder="使用者名稱"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <input
        type="password"
        placeholder="密碼"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
        註冊
      </button>
    </form>
  );
}