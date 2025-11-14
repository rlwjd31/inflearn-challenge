"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Check } from "lucide-react";
import { signUp } from "@/app/actions/auth-actions";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

const socialProviders = [
  {
    id: "kakao-provider",
    label: "카카오 회원가입",
    icon: "/icons/kakao.svg",
    bgStyle: "bg-[#ffd43b] hover:bg-[#fcc419]",
  },
  {
    id: "google-provider",
    label: "구글 회원가입",
    icon: "/icons/google.svg",
    bgStyle: "bg-[#f1f3f5] hover:bg-[#e9ecef]",
  },
];

const passwordRequirements = [
  "영문/숫자/특수문자 중, 2가지 이상 포함",
  "8자 이상 32자 이하 입력 (공백 제외)",
  "연속 3자 이상 동일한 문자/숫자 제외",
];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: 이메일 검증
    // TODO: 비밀번호 검증
    if (password !== confirmPassword)
      return alert("비밀번호가 일치하지 않습니다.");

    const response = await signUp({ email, password });

    if (response.status >= 200 && response.status < 400) {
      return redirect("/signin");
    }

    alert(response.message);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md">
        {/* 상단 로고 */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="flex size-14 items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 rounded-full cursor-pointer transition-all duration-300"
          >
            <Image
              src="/icons/inflearn.svg"
              alt="inflearn icon"
              width={22}
              height={22}
              className="size-6"
            />
          </Link>
        </div>

        {/* 제목 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-900">회원가입</h1>
          <p className="text-sm text-slate-900">
            인프런에서 다양한 학습의 기회를 얻으세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* 이메일 입력 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">이메일</Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="example@inflab.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 rounded-xl border px-4 text-sm transition ${"border-slate-200 focus:border-emerald-400 focus:ring-emerald-100"}`}
              />
            </div>
          </div>

          {/* 비밀번호 입력 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <div className="relative">
              {/* TODO: 검증에 따른 helperText와 input의 style을 적용할 수 있도록 component customization 진행 */}
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 px-4 pr-12 text-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-800"
              />
              {/* TODO: Custom button 후 적용하기 => 배경색이 무엇이 들어올 지 모르기 때문에 brightness utility class사용해서 구현하기 */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            {/* 비밀번호 validation list */}
            <div className="mt-2 flex flex-col gap-2 rounded-lg bg-slate-50 p-3">
              {passwordRequirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <Check className="size-4 shrink-0 text-emerald-500" />
                  <span>{requirement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="비밀번호를 다시 입력해 주세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-xl border border-slate-200 px-4 pr-12 text-sm transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* 가입하기 버튼 - submit */}
          <Button
            type="submit"
            className="h-12 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-500/90 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
          >
            가입하기
          </Button>
        </form>

        {/* 간편 회원가입 - social login */}
        <div className="mt-8 flex flex-col items-center gap-5">
          <div className="flex w-full items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-slate-400">간편 회원가입</span>
            <Separator className="flex-1" />
          </div>

          <div className="flex gap-3">
            {socialProviders.map((provider) => (
              <Button
                key={provider.id}
                type="button"
                variant="outline"
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-2xl border-slate-200 transition-all duration-300 cursor-pointer",
                  provider.bgStyle
                )}
                aria-label={provider.label}
              >
                <Image
                  src={provider.icon}
                  alt={provider.label}
                  width={24}
                  height={24}
                  className="size-6"
                />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
