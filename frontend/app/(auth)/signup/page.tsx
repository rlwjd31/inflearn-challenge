import { Metadata } from "next";

import SignUpUI from "@/app/(auth)/signup/SignUpUI";

export const metadata: Metadata = {
  title: "회원가입 - fakeInflearn",
  description: "Fake inflearn(인프런) 회원가입 페이지입니다.",
};
export default function SignUpPage() {
  return <SignUpUI />;
}
