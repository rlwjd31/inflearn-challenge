import { Metadata } from "next";
import { notFound } from "next/navigation";

import EditCourseInfoUI from "@/app/course/[id]/edit/course_info/EditCourseInfoUI";
import { CourseEntity } from "@/generated/openapi-client";
import * as api from "@/lib/api";

export const metadata: Metadata = {
  title: "강좌 정보 편집 - 인프런",
  description: "인프런 강좌 정보 편집 페이지입니다.",
};

export default async function EditCourseInfoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = await params;

  let course: CourseEntity;
  try {
    const { data } = await api.getCourseById(courseId);

    if (!data) {
      notFound();
    }

    course = data;
  } catch (error) {
    console.error(error);
    notFound();
  }

  return <EditCourseInfoUI course={course} />;
}
