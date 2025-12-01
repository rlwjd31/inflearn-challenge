import EditCourseCurriculumUI from "@/app/course/[id]/edit/curriculum/EditCourseCurriculumUI";
import { CourseEntity } from "@/generated/openapi-client";
import * as api from "@/lib/api";
import { notFound } from "next/navigation";

export default async function EditCourseCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let course: CourseEntity;

  // TODO: 추후 해당 fetching course logic이 동일하게 반복된면 refactoring 진행 필요
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

  return <EditCourseCurriculumUI course={course} />;
}
