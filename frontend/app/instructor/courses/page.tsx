import CourseManagementTable from "@/app/instructor/courses/_components/CourseManagementTable";
import { getAllInstructorCourses } from "@/lib/api";

export default async function InstructorCoursesPage() {
  const { data: instructorCourses } = await getAllInstructorCourses();

  return <CourseManagementTable courses={instructorCourses || []} />;
}
