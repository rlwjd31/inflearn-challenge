"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as api from "@/lib/api";

export default function CreateCourseUI() {
  const router = useRouter();
  const [title, setTitle] = useState("");

  const createCourseMutation = useMutation({
    mutationFn: () => api.createCourse(title),
    onSuccess: ({ data }) => {
      if (data) {
        router.push(`/course/${data.id}/edit/course_info`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="w-full max-w-xl mx-auto h-[90vh] flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl text-center font-bold">
        제목을 입력해주세요!
        <br />
        너무 고민하지마세요. 제목은 언제든 수정 가능해요 :)
      </h2>
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요."
        className="bg-[#F6F6F6] py-6 rounded-md"
      />
      <div className="space-x-2">
        <Button variant="outline" className="px-8 py-6 text-md font-bold">
          이전
        </Button>
        <Button
          onClick={() => createCourseMutation.mutate()}
          variant="default"
          className="px-8 py-6 text-md font-bold"
        >
          만들기
        </Button>
      </div>
    </div>
  );
}
