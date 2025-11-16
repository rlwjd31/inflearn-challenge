import ClientTestUser from "@/app/user-api-test/client-test";
import ServerTestUser from "@/app/user-api-test/server-test";

export default function UserTestPage() {
  return (
    <div>
      <ServerTestUser />
      <div className="h-12" />
      <ClientTestUser />
    </div>
  );
}
