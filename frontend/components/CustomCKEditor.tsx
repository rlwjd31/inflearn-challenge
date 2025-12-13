"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Heading, // h1, h2, h3
  Essentials, // do, undo
  Paragraph, // paragraph
  Bold,
  Link,
  List, // bulletedList, numberedList
  Indent, // indent, outdent
  BlockQuote,
  Image, // ImageUpload랑 같이 사용해야 함
  ImageUpload,
  Table,
  Italic,
  EventInfo,
  Autoformat,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import { useEffect, useRef, useState } from "react";

type CustomCKEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

// TODO: auto saving 기능 추가하기 -> https://ckeditor.com/docs/ckeditor5/latest/features/autosave.html
export default function CustomCKEditor({
  value,
  onChange,
}: CustomCKEditorProps) {
  const editorRef = useRef<ClassicEditor>(null);
  const editorToolbarRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleEditorReady = (classicEditor: ClassicEditor) => {
    editorRef.current = classicEditor;
  };

  const handleOnChange = (event: EventInfo, editor: ClassicEditor) => {
    const data = editor.getData();
    // onChange(data);
  };

  return (
    <div className="ck-editor-container">
      <div ref={editorToolbarRef} className="min-h-[300px] border p-4 rounded">
        {!isMounted && <p>Loading editor...</p>}
        {isMounted && (
          <CKEditor
            editor={ClassicEditor}
            onReady={handleEditorReady}
            onChange={handleOnChange}
            data={value}
            config={{
              licenseKey: "GPL",
              plugins: [
                // @FIXME: heading tag의 스타일이 적용되지 않음.
                Heading,
                Essentials,
                Paragraph,
                Autoformat,
                Bold,
                Italic,
                Link,
                List,
                Indent,
                BlockQuote,
                Table,
                Image,
                ImageUpload,
              ],
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "|",
                "outdent",
                "indent",
                "|",
                "imageUpload",
                "blockQuote",
                "insertTable",
                "undo",
                "redo",
              ],
              initialData: "<p>Hello from CKEditor 5 in React!</p>",
            }}
          />
        )}
      </div>
    </div>
  );
}
