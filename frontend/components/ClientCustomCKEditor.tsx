"use client";

import dynamic from "next/dynamic";

const ClientSideCustomEditor = dynamic(
  () => import("@/components/CustomCKEditor"),
  { ssr: false }
);

export default ClientSideCustomEditor;
