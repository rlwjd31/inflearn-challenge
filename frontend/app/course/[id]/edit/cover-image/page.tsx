import { Metadata } from "next";
import { notFound } from "next/navigation";

import * as api from "@/lib/api";
import EditCourseCoverImageUI from "@/app/course/[id]/edit/cover-image/EditCourseCoverImageUI";

export const metadata: Metadata = {
  title: "강좌 커버 이미지 편집 - 인프런",
  description: "인프런 강좌 커버 이미지 편집 페이지입니다.",
};

export default async function EditCourseCoverImagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;
  const { data: course } = await api.getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return <EditCourseCoverImageUI course={course} />;
}
