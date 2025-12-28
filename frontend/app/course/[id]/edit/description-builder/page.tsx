import { notFound } from "next/navigation";
import { Metadata } from "next";

import EditCourseDescriptionBuilderUI from "@/app/course/[id]/edit/description-builder/EditCourseDescriptionBuilderUI";
import * as api from "@/lib/api";

export const metadata: Metadata = {
  title: "강좌 편집 - 인프런",
  description: "인프런 강좌 편집 페이지입니다.",
};

type EditCourseDescriptionBuilderPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCourseDescriptionBuilderPage({
  params,
}: EditCourseDescriptionBuilderPageProps) {
  const { id: courseId } = await params;
  const { data: course } = await api.getCourseById(courseId);

  if (!course) {
    notFound();
  }

  return <EditCourseDescriptionBuilderUI course={course} />;
}
