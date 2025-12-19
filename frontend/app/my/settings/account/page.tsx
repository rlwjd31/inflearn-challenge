import AccountUI from "@/app/my/settings/account/AccountUI";
import * as api from "@/lib/api";

export default async function AccountPage() {
  const { data: profile } = await api.getProfile();

  if (!profile) return <div>프로필이 존재하지 않습니다...</div>;

  return <AccountUI profile={profile} />;
}
