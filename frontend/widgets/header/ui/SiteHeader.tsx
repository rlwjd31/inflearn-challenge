"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, Search, X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CategoryEntity, UserEntity } from "@/generated/openapi-client";
import { CATEGORY_ICONS } from "@/widgets/header/constants/category-icons";

const hideCategoryRoutes = ["/instructor", "/create_courses"];
const hideHeaderRoutes = ["/course"];

const getCategoryIcon = (slug: string) =>
  CATEGORY_ICONS[slug as keyof typeof CATEGORY_ICONS] ?? CATEGORY_ICONS.default;

export default function SiteHeader({
  profile,
  categories,
}: {
  profile?: UserEntity;
  categories: CategoryEntity[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const showHeader = !hideHeaderRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const showCategorySection = !hideCategoryRoutes.includes(pathname);

  if (!showHeader) return null;

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
          <Popover>
            <PopoverTrigger asChild>
              <div className="ml-2 cursor-pointer">
                <Avatar>
                  {profile?.imageUrl ? (
                    <Image
                      src={profile.imageUrl}
                      alt="avatar"
                      fill
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <AvatarFallback>
                      <span role="img" aria-label="user">
                        👤
                      </span>
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-0">
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none"
                onClick={() => (window.location.href = "/my/settings/account")}
              >
                <div className="font-semibold text-gray-800">
                  {profile?.name || profile?.email || "내 계정"}
                </div>
              </button>
            </PopoverContent>
          </Popover>
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
          <ScrollArea className="w-full">
            <div className="flex items-center gap-3 py-2 md:px-6">
              {/*  Categories props */}
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.slug);

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
              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </nav>
      )}
    </header>
  );
}
