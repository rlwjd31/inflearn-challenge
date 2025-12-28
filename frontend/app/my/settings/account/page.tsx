import AccountUI from "@/app/my/settings/account/AccountUI";
import * as api from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "계정 설정 - 인프런",
  description: "인프런 계정 설정 페이지입니다.",
};

export default async function AccountPage() {
  const { data: profile } = await api.getProfile();

  if (!profile) return <div>프로필이 존재하지 않습니다...</div>;

  return <AccountUI profile={profile} />;
}
