import { Metadata } from "next";

import CreateCourseUI from "@/app/create_courses/UI";

export const metadata: Metadata = {
  title: "강좌 생성 - 인프런",
  description: "인프런 강좌 생성 페이지입니다.",
};

export default function CreateCoursePage() {
  return <CreateCourseUI />;
}
