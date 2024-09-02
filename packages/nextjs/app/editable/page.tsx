"use client";

import type { NextPage } from "next";
import { MarkdownRenderer } from "~~/components/MarkdownRenderer";

const Editable: NextPage = () => {
  const markdownText = `
# My Markdown Document

- ✅ Task 1: Complete the project
- ❌ Task 2: Missed the deadline
- ⚠️ Task 3: Needs review
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

  return (
    <div className="p-4">
      <MarkdownRenderer markdown={markdownText} />
    </div>
  );
};

export default Editable;
