"use client";

import EditLectureDialog from "@/app/course/[id]/edit/curriculum/_components/Dialog";
import { LectureEntity } from "@/generated/openapi-client";
import { useState } from "react";

export default function TestDialog({ lecture }: { lecture: LectureEntity }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleDialogClose = () => {
    setIsOpen((prev) => !prev);
  };

  console.log("below is props lecture 👇👇👇");
  console.log(lecture);

  return (
    <EditLectureDialog
      isOpen={isOpen}
      onClose={handleDialogClose}
      lecture={lecture}
    />
  );
}
