'use client';


interface LoginFormProps {
  loginEmail: string;
  loginPassword: string;
  setLoginEmail: (email: string) => void;
  setLoginPassword: (password: string) => void;
  onLogin: (setErrorMessage: (msg: string) => void) => Promise<void>;
  errorMessage?: string;
}

export default function LoginForm({
  loginEmail,
  loginPassword,
  setLoginEmail,
  setLoginPassword,
  onLogin,
  errorMessage
}: LoginFormProps) {

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(() => { }); // 調用外部傳入的登入邏輯
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm">
      <h2 className="text-xl font-semibold mb-4">登入</h2>
      {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
      <input
        type="email"
        placeholder="Email"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        className="w-full border p-2 mb-3 rounded"
        required
      />
      <input
        type="password"
        placeholder="密碼"
        value={loginPassword}
        onChange={(e) => setLoginPassword(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        登入
      </button>
    </form>
  );
}