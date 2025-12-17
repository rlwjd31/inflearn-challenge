/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LectureEntity } from "@/generated/openapi-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import * as api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileVideo } from "lucide-react";
import ClientSideCustomEditor from "@/components/ClientCustomCKEditor";
import { Button } from "@/components/ui/button";

type EditLectureDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureEntity;
};

type EditLectureForm = {
  title: string;
  description: string;
  videoStorageInfo?: any;
};

const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB
const ACCEPTED_VIDEO_TYPES = {
  "video/mp4": [".mp4"],
  "video/x-matroska": [".mkv"],
  "video/x-m4v": [".m4v"],
  "video/quicktime": [".mov"],
};

export default function EditLectureDialog({
  isOpen,
  onClose,
  lecture,
}: EditLectureDialogProps) {
  const queryClient = useQueryClient();
  const [lectureForm, setLectureForm] = useState<EditLectureForm>({
    title: lecture.title,
    description: lecture.description ?? "<p>강의의 설명을 적어주세요.</p>",
    videoStorageInfo: lecture.videoStorageInfo,
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const { data } = await api.uploadMedia(file);

        if (!data) {
          throw new Error("미디어 업로드에 실패했습니다.");
        }

        setLectureForm((prev) => ({ ...prev, videoStorageInfo: data }));
        toast.success("미디어를 성공적으로 업로드되었습니다.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "미디어 업로드에 실패했습니다."
        );
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_VIDEO_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const editLectureMutation = useMutation({
    // TODO: data를 받아서 넣을지 추후 생각 go.
    mutationFn: async (data: EditLectureForm) =>
      api.updateLecture(lecture.id, {
        ...lectureForm,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", lecture.courseId],
      });
      toast.success("강의가 수정되었습니다.");
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editLectureMutation.mutate(lectureForm);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>강의 수정</DialogTitle>
        </DialogHeader>
        {lecture && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={lectureForm.title}
                onChange={(e) =>
                  setLectureForm((prev) => ({ ...prev, title: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>강의 영상</Label>
              {/* 업로드 된 강의 미리보기 */}
              {lectureForm.videoStorageInfo && (
                <div className="w-full h-auto min-h-[200px]">
                  <video
                    autoPlay={true}
                    controls={true}
                    // * cloudfront는 streaming을 지원한다.
                    src={lectureForm.videoStorageInfo.s3?.cloudFront?.url}
                  />
                </div>
              )}

              {/* 권장 영상 형식 안내 */}
              <p className="text-sm text-gray-500 mb-2">
                • 최대 파일 크기: 5GB
                <br />
                • 지원 형식: .mp4, .mkv, .m4v, .mov
                <br />• 최소 해상도: 1080p 이상 (권장)
              </p>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                  isDragActive ? "border-primary" : "border-gray-300"
                }`}
              >
                <input {...getInputProps()} />
                <div className="py-8">
                  <FileVideo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {lectureForm.videoStorageInfo
                      ? `선택된 파일: ${lectureForm.videoStorageInfo.fileName}`
                      : isDragActive
                      ? "파일을 여기에 놓아주세요"
                      : "클릭하거나 파일을 드래그하여 업로드하세요"}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">수업 노트</Label>
              <ClientSideCustomEditor
                value={lectureForm.description}
                onChange={(value) =>
                  setLectureForm((prev) => ({ ...prev, description: value }))
                }
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                취소
              </Button>
              <Button type="submit" disabled={editLectureMutation.isPending}>
                {editLectureMutation.isPending ? "수정 중..." : "수정"}
              </Button>
            </div>
          </form>
        )}
        {!lecture && <div>강의 정보를 불러올 수 없습니다.</div>}
      </DialogContent>
    </Dialog>
  );
}
