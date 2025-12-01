import { ReactNode } from "react";
import * as api from "@/lib/api";
import EditCourseHeader from "@/app/course/[id]/edit/_components/EditCourseHeader";
import EditCourseSidebar from "@/app/course/[id]/edit/_components/EditCourseSidebar";
import { notFound } from "next/navigation";
import { CourseEntity } from "@/generated/openapi-client";

export default async function EditCourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let course: CourseEntity;
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
    <div className="w-full h-full bg-[#F1F3F5]">
      <EditCourseHeader title={course.title} />
      <div className="p-12 flex gap-12 min-h-screen">
        <EditCourseSidebar />
        {children}
      </div>
    </div>
  );
}
