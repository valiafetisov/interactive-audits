"use client";

import { useEffect, useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import type { NextPage } from "next";
import { CodeBracketIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { MarkdownRenderer } from "~~/components/MarkdownRenderer";
import { parseMd, renderMd } from "~~/utils/md-parser";

const markdownText = `
# My Markdown Document

- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi
`;

const Editable: NextPage = () => {
  const [mode, setMode] = useState<"fillIn" | "editSource">("fillIn");
  const [markdown, setMarkdown] = useState(markdownText);

  useEffect(() => {
    const fetchMarkdown = async () => {
      // parse the markdown checklist conclusions into emojis
      const { tree, currentCheckboxes } = await parseMd(markdown);
      const renderedMarkdown = await renderMd({ tree, checkboxes: currentCheckboxes });
      setMarkdown(renderedMarkdown);
    };
    fetchMarkdown();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="py-4 flex flex-col gap-2">
      <div className="text-end space-x-2">
        {mode !== "fillIn" && (
          <button className="btn btn-sm font-bold w-32 border-primary border-2" onClick={() => setMode("fillIn")}>
            <PencilSquareIcon className="h-5 w-5 inline-block mr-1" />
            Fill in
          </button>
        )}
        {mode !== "editSource" && (
          <button className="btn btn-sm font-bold w-36 border-primary border-2" onClick={() => setMode("editSource")}>
            <CodeBracketIcon className="h-5 w-5 inline-block mr-1" />
            Edit source
          </button>
        )}
      </div>
      {mode === "fillIn" && <MarkdownRenderer markdown={markdown} setMarkdown={setMarkdown} />}
      {mode === "editSource" && <MarkdownEditor value={markdown} onChange={(value: string) => setMarkdown(value)} />}
    </div>
  );
};

export default Editable;
