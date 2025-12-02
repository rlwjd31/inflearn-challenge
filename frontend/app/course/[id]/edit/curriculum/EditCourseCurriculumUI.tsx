"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CourseEntity, SectionEntity } from "@/generated/openapi-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import * as api from "@/lib/api";
import { toast } from "sonner";
import { notFound } from "next/navigation";

export default function EditCourseCurriculumUI({
  courseProps,
}: {
  courseProps: CourseEntity;
}) {
  const queryClient = useQueryClient();

  // 섹션 추가 상태
  const [addSectionTitle, setAddSectionTitle] = useState("");

  // * fetch course by id
  // 상위 component는 server component이므로 course를 props로 받지만 course의 정보가 바뀌면 re-rendering이 되지 않아 어차피 useQuery를 사용해야 한다.
  const {
    data: course,
    error: courseFetchError,
    isLoading: courseFetchLoading,
  } = useQuery({
    queryKey: ["course", courseProps.id],
    queryFn: async () => {
      const { data } = await api.getCourseById(courseProps.id);

      return data;
    },
  });

  // * ============ mutate function ============

  // * 섹션 추가
  const addSectionMutation = useMutation({
    mutationFn: async (title: string) => {
      if (!course) {
        toast.error("강좌를 불러오는데 오류가 발생했습니다.");
        return;
      }

      return await api.createSection(courseProps.id, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseProps.id],
      });
      toast.success("섹션이 추가되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // UI handler
  const handleAddSection = () => {
    // section title이 비어있으면 기본 값으로 placeholder 값을 넣어줌
    addSectionMutation.mutate(addSectionTitle || "섹션 제목을 작성해주세요.");
    setAddSectionTitle("");
  };

  // * UI rendering logic
  if (courseFetchLoading) {
    return;
  }

  if (courseFetchError) {
    return <div>Error: {courseFetchError.message}</div>;
  }

  if (!course) {
    return <div>cannot fetch course</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">커리큘럼</h1>
          </CardTitle>
        </CardHeader>
      </Card>

      {(course?.sections ?? [])?.map(
        (section: SectionEntity, sectionIdx: number) => {
          return (
            <div key={section.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 font-semibold">
                  섹션 {sectionIdx + 1}
                </span>
             
              </div>
            </div>
          );
        }
      )}

      {/* 섹션 추가 */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 font-semibold">섹션 추가</span>
          <Input
            className="w-64"
            value={addSectionTitle}
            onChange={(e) => setAddSectionTitle(e.target.value)}
            placeholder="섹션 제목을 작성해주세요. (최대 200자)"
            maxLength={200}
          />
          <Button onClick={handleAddSection} variant="default" size="sm">
            추가
          </Button>
        </div>
      </div>
    </div>
  );
}
