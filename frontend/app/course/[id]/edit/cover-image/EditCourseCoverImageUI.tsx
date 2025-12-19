"use client";

import { CourseEntity } from "@/generated/openapi-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { VideoStorageInfo } from "@/lib/api.type";
import { MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/config/dropzone-file.config";

type EditCourseCoverImageUIProps = {
  course: CourseEntity;
};

export default function EditCourseCoverImageUI({
  course,
}: EditCourseCoverImageUIProps) {
  const queryClient = useQueryClient();
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>(
    course.thumbnailUrl ||
      "https://d255jagofabe5c.cloudfront.net/cover-image-test.jpeg"
  );
  const updateCourseThumbnailMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data } = (await api.uploadMedia(file)) as {
        data: VideoStorageInfo;
      };
      const thumbnailUrl = data.s3.cloudFront.url;

      setThumbnailImageUrl(thumbnailUrl);

      return api.updateCourse(course.id, { thumbnailUrl });
    },
    onSuccess: () => {
      toast.success("강의 썸네일 이미지가 성공적으로 수정되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["course", course.id],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      // 여기서 setThumbnailImageUrl을 해주면?
      if (file) {
        updateCourseThumbnailMutation.mutate(file);
      }
    },
    [updateCourseThumbnailMutation]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_IMAGE_SIZE,
  });
  
  // https://d255jagofabe5c.cloudfront.net/cover-image-test.jpeg
  return (
    <div className="space-y-4 prose bg-white p-8 rounded-lg">
      <h2>커버 이미지 업로드</h2>
      <div className="space-y-2">
        {/* 업로드 된 이미지 미리보기 */}
        {thumbnailImageUrl && (
          <div className="w-full h-auto min-h-[200px] relative rounded-lg overflow-hidden">
            <Image
              src={thumbnailImageUrl}
              alt="썸네일 이미지"
              width={1000}
              height={1000}
              className="size-full object-cover"
            />
          </div>
        )}

        {/* 권장 이미지 형식 안내 */}
        <p className="text-sm text-gray-500 mb-2">
          • 최대 파일 크기: 5MB
          <br />
          • 지원 형식: .jpg, .jpeg, .png, .gif
          <br />• 권장 해상도: 1200 x 781px
        </p>

        {/* 드래그 앤 드롭 영역 */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer",
            isDragActive ? "border-primary" : "border-gray-300"
          )}
        >
          <input {...getInputProps()} />
          <div className="py-8">
            {updateCourseThumbnailMutation.isPending ? (
              <Loader2 className="size-12 mx-auto mb-4 text-gray-400 animate-spin" />
            ) : (
              <>
                <ImageIcon className="size-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {thumbnailImageUrl
                    ? "클릭하여 이미지 변경"
                    : isDragActive
                    ? "이미지를 여기에 놓아주세요"
                    : "클릭하거나 이미지를 드래그하여 업로드하세요"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
