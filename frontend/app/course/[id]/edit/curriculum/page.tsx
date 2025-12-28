import { notFound } from "next/navigation";
import { Metadata } from "next";

import EditCourseCurriculumUI from "@/app/course/[id]/edit/curriculum/EditCourseCurriculumUI";
import { CourseEntity } from "@/generated/openapi-client";
import * as api from "@/lib/api";

export const metadata: Metadata = {
  title: "강좌 편집 - 인프런",
  description: "인프런 강좌 편집 페이지입니다.",
};

export default async function EditCourseCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let course: CourseEntity;

  // TODO: 추후 해당 fetching course logic이 동일하게 반복된면 refactoring 진행 필요 => edit layout에서도 이미 사용됨.
  try {
    const { data } = await api.getCourseById(id);

    if (!data) {
      notFound();
    }

    course = data;
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="flex flex-col gap-12">
      <EditCourseCurriculumUI courseProps={course} />
    </div>
  );
}
