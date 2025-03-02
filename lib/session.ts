import { auth } from "./auth";

export async function getCurrentUser() {
  // セッション取得
  const session = await auth();
  return session?.user;
}