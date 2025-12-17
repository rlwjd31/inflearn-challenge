import EditCourseDescriptionBuilderUI from "@/app/course/[id]/edit/description-builder/EditCourseDescriptionBuilderUI";
import * as api from "@/lib/api";
import { notFound } from "next/navigation";

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
