import { signOut } from "@/app/actions/auth-actions";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "인프런 - 라프임 커어 플랫폼",
  description: "인프런은 라이프타임 커리어 플랫폼입니다."
}

export default async function Home() {
  const userSession = await auth();
  return (
    <div>
      <p>이메일: {userSession?.user?.email}</p>
      <pre>{JSON.stringify(userSession)}</pre>
      <form action={signOut}>
        <button
          type="submit"
          className="bg-emerald-800 text-white px-4 py-2 rounded-xl cursor-pointer"
        >
          logout
        </button>
      </form>
    </div>
  );
}
