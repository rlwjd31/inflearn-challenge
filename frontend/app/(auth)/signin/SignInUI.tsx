"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { signIn } from "@/app/actions/auth-actions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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

export default function SignInUI() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    await signIn(formData);
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/60">
        {/* Inflearn logo */}
        <Image
          src="/icons/inflearn-logo-with-text.png"
          alt="inflearn logo with text"
          width={120}
          height={22}
          className="mx-auto mb-8"
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="example@inflab.com"
              className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus-visible:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                비밀번호
              </label>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              className="h-12 rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="h-12 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-500/90 focus:outline-none focus:ring-2 focus:ring-emerald-200 cursor-pointer"
          >
            로그인
          </Button>
        </form>

        <div className="mt-5 flex justify-center gap-3 text-xs text-slate-400">
          <Link href="/forgot-password" className="hover:text-emerald-500">
            비밀번호 찾기
          </Link>
          <span className="text-slate-200">|</span>
          <Link href="/signup" className="hover:text-emerald-500">
            회원가입
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center gap-5">
          <div className="flex w-full items-center gap-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">간편 로그인</span>
            <span className="h-px flex-1 bg-slate-200" />
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
