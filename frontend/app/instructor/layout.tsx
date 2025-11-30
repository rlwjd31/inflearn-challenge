import InstructorPageName from "@/app/instructor/_components/InstructorPageName";
import InstructorSidebar from "@/app/instructor/_components/InstructorSidebar";
import { ReactNode } from "react";

export default function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <InstructorPageName />
      <div className={"flex w-7xl mx-auto"}>
        <InstructorSidebar />
        {children}
      </div>
    </div>
  );
}
