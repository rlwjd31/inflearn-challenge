import { Metadata } from "next";

import CourseManagementTable from "@/app/instructor/courses/_components/CourseManagementTable";
import { getAllInstructorCourses } from "@/lib/api";

export const metadata: Metadata = {
  title: "강좌 관리 - 인프런",
  description: "인프런 강좌 관리 페이지입니다.",
};

export default async function InstructorCoursesPage() {
  const { data: instructorCourses } = await getAllInstructorCourses();

  return <CourseManagementTable courses={instructorCourses || []} />;
}
