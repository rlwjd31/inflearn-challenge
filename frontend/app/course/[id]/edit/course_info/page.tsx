import EditCourseInfoUI from "@/app/course/[id]/edit/course_info/EditCourseInfoUI";
import { CourseEntity } from "@/generated/openapi-client";
import * as api from "@/lib/api";
import { notFound } from "next/navigation";

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
