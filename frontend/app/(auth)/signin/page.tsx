import SignInUI from "@/app/(auth)/signin/SignInUI";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 - fakeInflearn",
  description: "Fake inflearn(인프런) 로그인 페이지입니다.",
};

export default function SignInPage() {
  return <SignInUI />;
}
