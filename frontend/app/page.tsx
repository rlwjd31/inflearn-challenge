import { signOut } from "@/app/actions/auth-actions";
import { auth } from "@/auth";

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
