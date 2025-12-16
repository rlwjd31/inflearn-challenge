import { notFound } from "next/navigation";
import * as api from "@/lib/api";
import EditCourseCoverImageUI from "@/app/course/[id]/edit/cover-image/EditCourseCoverImageUI";

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
