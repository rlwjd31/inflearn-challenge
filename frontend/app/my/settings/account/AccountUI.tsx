"use client";

import { useMutation } from "@tanstack/react-query";
import { FormEvent, useCallback, useState } from "react";

import { UserEntity } from "@/generated/openapi-client";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { VideoStorageInfo } from "@/lib/api.type";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import ClientSideCustomEditor from "@/components/ClientCustomCKEditor";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
};

export default function AccountUI({ profile }: { profile: UserEntity }) {
  const [imageUrl, setImageUrl] = useState(profile.imageUrl ?? "");
  const [name, setName] = useState(profile.name ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const router = useRouter();

  const updateProfileMutation = useMutation({
    mutationFn: async () =>
      api.updateProfile({
        name,
        imageUrl,
        bio,
      }),
    onSuccess: () => {
      toast.success("프로필 업데이트가 완료되었습니다.");
      // 서버쪽에서 내려주는 profile 정보를 업데이트 해야 함
      router.refresh();
    },
    onError: (error) =>
      toast.error(
        error instanceof Error ? error.message : "프로필 수정에 실패했습니다."
      ),
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const { data } = (await api.uploadMedia(file)) as {
        data: VideoStorageInfo;
      };

      if (!data) {
        toast.error("프로필 이미지 업로드에 실패했습니다.");
        return;
      }

      setImageUrl(data.s3.cloudFront.url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_IMAGE_TYPES,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-lg mt-10 shadow">
      <h2 className="text-2xl font-bold mb-6">계정 설정</h2>
      <form onSubmit={handleSave} className="space-y-6">
        {/* 프로필 이미지 업로드 */}
        <div>
          <label className="block font-medium mb-2">프로필 이미지</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
              isDragActive ? "border-primary" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            <div className="py-4 flex flex-col items-center">
              {updateProfileMutation.isPending ? (
                <Loader2 className="size-10 text-gray-400 animate-spin mb-2" />
              ) : imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="프로필 미리보기"
                  width={96}
                  height={96}
                  className="object-cover rounded-full mx-auto mb-2 border"
                />
              ) : (
                <ImageIcon className="size-10 text-gray-400 mb-2" />
              )}
              <span className="text-sm text-gray-600">
                {imageUrl
                  ? "클릭하여 변경"
                  : isDragActive
                  ? "이미지를 여기에 놓으세요"
                  : "클릭하거나 이미지를 드래그하여 업로드"}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            최대 5MB, jpg/png/gif 지원
          </p>
        </div>
        {/* 이름 */}
        <div>
          <label className="block font-medium mb-2">이름</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
            required
          />
        </div>
        {/* 자기소개 */}
        <div>
          <label className="block font-medium mb-2">자기소개</label>
          <ClientSideCustomEditor value={bio} onChange={setBio} />
        </div>
        {/* 저장 버튼 */}
        <div className="pt-2">
          <Button
            disabled={updateProfileMutation.isPending}
            type="submit"
            className="w-full text-md font-bold"
            size={"lg"}
          >
            {updateProfileMutation.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <span>저장</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
