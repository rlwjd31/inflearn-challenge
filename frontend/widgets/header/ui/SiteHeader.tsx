"use client";
// export default function SiteHeader({
//   categories,
// }: {
//   categories: CategoryEntity[];
// }) {
//   return (
//     <header>
//       {categories.map((v) => (
//         <li key={v.id}>{v.name}</li>
//       ))}
//     </header>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Grid3x3,
  Star,
  Monitor,
  Gamepad2,
  Atom,
  Cpu,
  Shield,
  Palette,
  Briefcase,
  BookOpen,
  Compass,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CategoryEntity } from "@/generated/openapi-client";
import { useState } from "react";
import { usePathname } from "next/navigation";

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  전체: Grid3x3,
  "MY 카테고리": Star,
  "개발·프로그래밍": Monitor,
  "게임 개발": Gamepad2,
  "데이터 사이언스": Atom,
  인공지능: Cpu,
  "보안·네트워크": Shield,
  하드웨어: Cpu,
  "디자인·아트": Palette,
  "기획·경영·마케팅": Briefcase,
  "업무 생산성": BookOpen,
  "커리어·자기계발": Compass,
  "대학 교육": GraduationCap,
};

const getCategoryIcon = (name: string) => {
  for (const [key, Icon] of Object.entries(categoryIcons)) {
    if (name.includes(key) || key.includes(name)) {
      return Icon;
    }
  }
  return Grid3x3;
};

export default function SiteHeader({
  categories,
}: {
  categories: CategoryEntity[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const showCategorySection = !pathname.includes("instructor");

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      {/* Main Header */}
      <nav className="container font-bold mx-auto flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            {isMobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icons/inflearn-logo-with-text.png"
              alt="Inflearn"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            <Link
              href="/courses"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              강의
            </Link>
            <Link
              href="/roadmap"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              로드맵
            </Link>
            <Link
              href="/mentoring"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              멘토링
            </Link>
            <Link
              href="/community"
              className="text-sm text-foreground transition-colors hover:text-primary"
            >
              커뮤니티
            </Link>
          </div>

          {/* Mobile Menu Button */}
        </div>

        {/* Center: Search Bar */}
        <div className="hidden flex-1 max-w-2xl lg:block">
          <div className="relative">
            <Input
              type="search"
              placeholder="나의 진짜 성장을 도와줄 실무 강의를 찾아보세요"
              className="h-10 w-full pr-10"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
              aria-label="검색"
            >
              <Search className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* 지식 공유자 */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex font-bold"
          >
            지식 공유자
          </Button>

          {/* User Avatar */}
          <Button variant="ghost" size="icon" aria-label="사용자 메뉴">
            <Avatar className="size-8">
              <AvatarImage src="/icons/inflearn.svg" alt="User" />
              <AvatarFallback className="bg-primary/10">
                <Image
                  src="/icons/inflearn.svg"
                  alt="Inflearn"
                  width={16}
                  height={16}
                  className="size-4"
                />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="container mx-auto space-y-2 px-4 py-4">
            <Link
              href="/courses"
              className="block py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              강의
            </Link>
            <Link
              href="/roadmap"
              className="block py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              로드맵
            </Link>
            <Link
              href="/mentoring"
              className="block py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              멘토링
            </Link>
            <Link
              href="/community"
              className="block py-2 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              커뮤니티
            </Link>
            <div className="pt-2">
              <Input
                type="search"
                placeholder="강의를 찾아보세요"
                className="h-9"
              />
            </div>
          </div>
        </div>
      )}

      {/* Categories Bar */}
      {showCategorySection && (
        <nav className="bg-background">
          <ScrollArea className="w-full" orientation="horizontal">
            <div className="flex items-center gap-3 py-2 md:px-6">
              {/*  Categories props */}
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.name);

                return (
                  <Link
                    href={`/courses/${category.slug}`}
                    key={category.id}
                    className="category-item flex flex-col gap-2 items-center min-w-[72px] text-gray-700 hover:text-[#1dc078] cursor-pointer transition-colors"
                  >
                    <Icon className="size-4" />
                    <span className="text-sm whitespace-nowrap">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </ScrollArea>
        </nav>
      )}
    </header>
  );
}
