import * as api from "@/lib/api";

export default async function ServerTestUser() {
  const user = await api.getUserTest();

  return (
    <div>
      <h1>test fetch user with token at server component</h1>
      <pre>{JSON.stringify(user)}</pre>
    </div>
  );
}
