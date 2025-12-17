"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as api from "@/lib/api";
import { CourseEntity } from "@/generated/openapi-client";
import { toast } from "sonner";

export default function EditCourseHeader({ course }: { course: CourseEntity }) {
  const router = useRouter();
  const publishCourseMutation = useMutation({
    mutationFn: async () =>
      // 정확하게 구현을 하기 위해선 course 관련 정보를 다 검증 후 updateCourse를 호출하는 것이 맞다.
      api.updateCourse(course.id, { status: "PUBLISHED" }), // * 만약 admin 관리자가 허락을 해야 게시되는 강의라면 PUBLISHED_REQUESTED 상태로 변경하여 admin이 published로 바꾸게 해야 한다.
    onSuccess: () => {
      toast.success("강의가 성공적으로 게시되었습니다.");

      // ? invalidateQueries를 해야 된다고 생각했는데 현재 course는 상위 server component에서 받아온 것으로
      // ? "현재 route의 server component"를 다시 렌더링을 해주어 새로운 course를 받아오게 해야 하는 것이 맞다.
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "강의 게시에 실패했습니다.");
    },
  });

  console.log(publishCourseMutation);

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white">
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <div className="flex items-center gap-2">
        <Button
          disabled={
            publishCourseMutation.isPending || course.status === "PUBLISHED"
          }
          onClick={() => publishCourseMutation.mutate()}
          size={"lg"}
        >
          {publishCourseMutation.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : course.status === "PUBLISHED" ? (
            <span>제출완료</span>
          ) : (
            <span>제출하기</span>
          )}
        </Button>
        <Button
          onClick={() => router.push("/instructor/courses")}
          size="lg"
          variant={"outline"}
        >
          <X size={20} />
        </Button>
      </div>
    </header>
  );
}
