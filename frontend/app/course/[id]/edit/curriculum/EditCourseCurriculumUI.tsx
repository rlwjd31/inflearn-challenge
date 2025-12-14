"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import * as api from "@/lib/api";
import {
  CourseEntity,
  LectureEntity,
  SectionEntity,
} from "@/generated/openapi-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Lock, LockOpen, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import EditLectureDialog from "@/app/course/[id]/edit/curriculum/_components/Dialog";

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
  // 강의(lecture) 추가와 연관된 상태
  const [addLectureTitle, setAddLectureTitle] = useState("");
  const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
  // 강의를 추가할 때 sectionId가 필요하며 dialog를 open시 sectionId를 설정
  const [addLectureSectionId, setAddLectureSectionId] = useState<string | null>(
    null
  );

  const [editLecture, setEditLecture] = useState<LectureEntity | null>(null);
  const [isEditLectureDialogOpen, setIsEditLectureDialogOpen] = useState(false);

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

  const toggleLecturePreviewMutation = useMutation({
    mutationFn: async ({ id, isPreview }: LectureEntity) => {
      if (!course) {
        toast.error("강좌를 불러오는데 오류가 발생했습니다.");
        return;
      }

      return await api.updateLecturePreview(id, !isPreview);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseProps.id],
      });
      toast.success("강의 미리보기 상태가 변경되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addLectureMutation = useMutation({
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

      return await api.createLecture(sectionId, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseProps.id],
      });
      toast.success("강의가 추가되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteLectureMutation = useMutation({
    mutationFn: async (lectureId: string) => {
      if (!course) {
        toast.error("강좌를 불러오는데 오류가 발생했습니다.");
        return;
      }

      return await api.deleteLecture(lectureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseProps.id],
      });
      toast.success("강의가 삭제되었습니다.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // ========================== UI handler ==========================
  const handleAddSection = () => {
    // section title이 비어있으면 기본 값으로 placeholder 값을 넣어줌
    addSectionMutation.mutate(addSectionTitle || "섹션 제목을 작성해주세요.");
    setAddSectionTitle("");
  };

  const handleDeleteSection = (sectionId: string) => {
    deleteSectionMutation.mutate(sectionId);
  };

  const handleToggleLecturePreview = (lecture: LectureEntity) => {
    toggleLecturePreviewMutation.mutate(lecture);
  };

  const handleOpenLectureDialog = (sectionId: string) => {
    setLectureDialogOpen(true);
    setAddLectureTitle("");
    setAddLectureSectionId(sectionId);
  };

  const handleAddLecture = () => {
    if (!addLectureSectionId && !addLectureTitle.trim()) return;

    addLectureMutation.mutate({
      sectionId: addLectureSectionId!,
      title: addLectureTitle,
    });

    setLectureDialogOpen(false);
    setAddLectureTitle("");
    setAddLectureSectionId(null);
  };

  const handleDeleteLecture = (lectureId: string) => {
    deleteLectureMutation.mutate(lectureId);
  };

  // * UI rendering logic -> 강의 정보는 fetching하는데 매우 빠름.
  if (courseFetchLoading) return;

  if (courseFetchError) {
    return <div>Error: {courseFetchError.message}</div>;
  }

  if (!course) {
    return <div>cannot fetch course</div>;
  }

  return (
    <>
      <div className="space-y-8 flex flex-col items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <h1 className="text-2xl font-bold">커리큘럼</h1>
            </CardTitle>
          </CardHeader>
        </Card>

        {(course?.sections ?? [])?.map(
          (section: SectionEntity, sectionIdx: number) => {
            return (
              <div
                key={section.id}
                className="border rounded-lg p-4 bg-white w-full"
              >
                {/* 섹션 */}
                <div className="flex items-center justify-between mb-2 ">
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
                {/* 강의 리스트 */}
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
                            onClick={() => handleToggleLecturePreview(lecture)}
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
                              console.log(
                                "lecture modify button is clicked!!!"
                              );
                              console.log(
                                "isEditLectureDialogOpen",
                                isEditLectureDialogOpen
                              );
                              setEditLecture(lecture);
                              setIsEditLectureDialogOpen(true);
                            }}
                            aria-label="강의 수정"
                          >
                            <Edit size={18} className="text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteLecture(lecture.id)}
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
                <div className="mt-3 flex gap-2 w-full justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenLectureDialog(section.id)}
                    className="bg-gray-50"
                  >
                    <Plus size={16} className="mr-1" /> 수업 추가
                  </Button>
                </div>
              </div>
            );
          }
        )}

        {/* 섹션 추가 */}
        {/* <div className="border rounded-lg p-4 bg-gray-50">
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
      </div> */}
        <Button
          onClick={handleAddSection}
          variant="default"
          size="lg"
          className="mx-auto text-shadow-md font-bold"
        >
          섹션 추가
        </Button>

        {/* 강의(lecture) 추가 dialog */}
        <Dialog open={lectureDialogOpen} onOpenChange={setLectureDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>수업 추가</DialogTitle>
            </DialogHeader>
            <Input
              value={addLectureTitle}
              onChange={(e) => setAddLectureTitle(e.target.value)}
              placeholder="제목을 입력해주세요. (최대 200자)"
              maxLength={200}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setLectureDialogOpen(false)}
              >
                취소
              </Button>
              <Button onClick={handleAddLecture} variant="default">
                추가
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* 강의 수정 Dialog */}
      {editLecture && (
        <EditLectureDialog
          isOpen={isEditLectureDialogOpen}
          onClose={() => {
            setIsEditLectureDialogOpen(false);
            setEditLecture(null);
          }}
          lecture={editLecture}
        />
      )}
    </>
  );
}
