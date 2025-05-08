import { FirebaseError } from "firebase/app";

export function getErrorMessage(error: unknown): { code: string; message: string } {
  if (typeof error === "string") return { code: "string", message: error };

  if (error && typeof error === "object" && "code" in error) {
    const code = (error as FirebaseError).code;

    switch (code) {
      case "auth/invalid-email":
        return { code, message: "無效的 Email 格式" };
      case "auth/email-already-in-use":
        return { code, message: "Email 已被使用，請改用其他帳號" };
      case "auth/user-not-found":
        return { code, message: "找不到使用者，請確認帳號是否正確" };
      case "auth/wrong-password":
        return { code, message: "密碼錯誤，請重新輸入" };
      case "auth/weak-password":
        return { code, message: "密碼強度不足，請至少輸入 6 個字元" };
      default:
        return { code, message: "發生錯誤：" + code };
    }
  }

  return { code: "unknown", message: "發生未知錯誤" };
}