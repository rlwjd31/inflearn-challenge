"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CourseEntity,
  LectureEntity,
  SectionEntity,
} from "@/generated/openapi-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import * as api from "@/lib/api";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import { Edit, Lock, LockOpen, Plus, Trash2 } from "lucide-react";

export default function EditCourseCurriculumUI({
  courseProps,
}: {
  courseProps: CourseEntity;
}) {
  const queryClient = useQueryClient();

  // 섹션 추가 상태
  const [addSectionTitle, setAddSectionTitle] = useState("");
  // 섹션별 임시 섹션 제목 상태
  const [sectionTitles, setSectionTitles] = useState<Record<string, string>>(
    {}
  );

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

  const updateSectionTitleMutation = useMutation({
    mutationFn: async ({
      sectionId,
      title,
    }: {
      sectionId: string;
      title: string;
    }) => {
      if (!course) {
        toast.error("강좌를 불러오는데 오류가 발생했습니다.");
        return;
      }

      return await api.updateSectionTitle(sectionId, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseProps.id],
      });
      toast.success("섹션 제목이 수정되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      if (!course) {
        toast.error("강좌를 불러오는데 오류가 발생했습니다.");
        return;
      }

      return await api.deleteSection(sectionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseProps.id],
      });

      toast.success("섹션이 삭제되었습니다.");
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

  const handleDeleteSection = (sectionId: string) => {
    deleteSectionMutation.mutate(sectionId);
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
                <div className="flex items-center gap-2">
                  <span className="text-green-600 font-semibold">
                    섹션 {sectionIdx + 1}
                  </span>
                  <Input
                    className="w-64"
                    value={sectionTitles[section.id] ?? section.title}
                    onChange={(e) => {
                      setSectionTitles((prev) => ({
                        ...prev,
                        [section.id]: e.target.value,
                      }));
                    }}
                    onBlur={(e) => {
                      const newTitle = e.target.value.trim();
                      if (newTitle && newTitle !== section.title) {
                        updateSectionTitleMutation.mutate({
                          sectionId: section.id,
                          title: newTitle,
                        });
                      }
                    }}
                    placeholder="섹션 제목을 작성해주세요."
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSection(section.id)}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                {section.lectures?.map(
                  (lecture: LectureEntity, lectureIdx: number) => (
                    <div
                      key={lecture.id}
                      className="flex items-center justify-between p-2 border rounded-md bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 w-5 text-center">
                          {lectureIdx + 1}
                        </span>
                        <span className="font-medium">{lecture.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* 미리 보기 icon */}
                        <Button
                          variant="ghost"
                          size="icon"
                          // TODO: handleToggleLecturePreview handler 구현하기
                          onClick={() => {}}
                          aria-label="미리보기 토글"
                        >
                          {lecture.isPreview ? (
                            <LockOpen className="text-green-600" size={18} />
                          ) : (
                            <Lock className="text-gray-400" size={18} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            /* TODO: 강의 수정 모달 오픈 */
                          }}
                          aria-label="강의 수정"
                        >
                          <Edit size={18} className="text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          // TODO: handleDeleteLecture handler 구현하기
                          onClick={() => {}}
                          className="text-red-500 hover:bg-red-100"
                          aria-label="강의 삭제"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  // TODO: openLectureDialog handler 구현하기
                  onClick={() => {}}
                >
                  <Plus size={16} className="mr-1" /> 수업 추가
                </Button>
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
