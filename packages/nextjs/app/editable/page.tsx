"use client";

import { useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import type { NextPage } from "next";
import { CodeBracketIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { MarkdownRenderer } from "~~/components/MarkdownRenderer";

const markdownText = `
# My Markdown Document

- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi


- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi


- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi


- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi


- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi


- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
- [ ] empty
- [x] hi
  - [x] hi
    - [x] hi


## Subheading

Here is some text with **bold** and _italic_ formatting.

### List of Items

1. First item
2. Second item
3. Third item

> This is a blockquote.
`;

const Editable: NextPage = () => {
  const [mode, setMode] = useState<"fillIn" | "editSource">("fillIn");
  const [markdown, setMarkDown] = useState(markdownText);

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
      {mode === "fillIn" && <MarkdownRenderer markdown={markdown} />}
      {mode === "editSource" && <MarkdownEditor value={markdown} onChange={(value: string) => setMarkDown(value)} />}
    </div>
  );
};

export default Editable;
