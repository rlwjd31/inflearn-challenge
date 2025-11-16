"use client";

import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

export default function ClientTestUser() {
  const { getUserTest } = useApi();

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getUserTest(),
  });

  if (isLoading) {
    return (
      <div>
        <h1>loading fetching user...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>test fetch user with token at client component</h1>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
