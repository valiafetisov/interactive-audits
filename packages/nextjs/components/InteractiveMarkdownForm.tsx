import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import "~~/styles/markdownRenderer.css";
import { Checkbox, parseMd, renderMd } from "~~/utils/md-parser";

interface MarkdownRendererProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
}

interface ClickableListItemProps {
  children: React.ReactNode;
  isSelected: boolean;
  setSelectedKey: () => void;
}

function getKeyFromPosition(position: any) {
  return `${position.start.line}-${position.end.line}`;
}

const ClickableListItem = ({ children, setSelectedKey, isSelected }: ClickableListItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setSelectedKey();
  };
  return (
    <li onClick={handleClick} className={`clickable-list-item ${isSelected ? "selected" : ""}`}>
      {children}
    </li>
  );
};

export const InteractiveMarkdownForm = ({ markdown, setMarkdown }: MarkdownRendererProps) => {
  const [index, setIndex] = useState(0);
  const { tree, currentCheckboxes } = parseMd(markdown);
  const [checkboxes] = useState<Checkbox[]>(currentCheckboxes);
  const checkbox = checkboxes[index];

  const selectedKey = checkboxes[index] ? getKeyFromPosition(checkboxes[index].position) : "";

  const moveIndex = (by: number) => {
    let nextIndex = (index + by) % checkboxes.length;
    if (nextIndex < 0) {
      nextIndex = checkboxes.length - 1;
    }
    setIndex(nextIndex);
  };

  const handleStatusSubmit = (selectedStatus: Checkbox["conclusion"]) => {
    checkboxes[index].conclusion = selectedStatus;
    setMarkdown(renderMd({ tree, checkboxes }));
    moveIndex(1);
  };

  const selectKey = (key: string) => {
    const index = checkboxes.findIndex(c => getKeyFromPosition(c.position) === key);
    if (index >= 0) {
      setIndex(index);
    }
  };

  return (
    <div className="markdown-body bg-white p-2 h-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter language={match[1]} PreTag="div">
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          li: ({ children, ...props }: any) => {
            // Generate a unique key for the list item based on its position
            const key = getKeyFromPosition(props.node.position);
            return (
              <ClickableListItem setSelectedKey={() => selectKey(key)} isSelected={selectedKey === key}>
                {children}
              </ClickableListItem>
            );
          },
          // Other markdown elements will use default rendering
        }}
      >
        {markdown}
      </ReactMarkdown>

      <div className="w-full flex fixed z-20 bottom-12 gap-2 p-2">
        <button className="btn btn-sm btn-outline bg-white" onClick={() => moveIndex(-1)}>
          Prev
        </button>
        <button className="btn btn-sm btn-outline bg-white" onClick={() => moveIndex(1)}>
          Next
        </button>
        <button
          className="btn btn-sm btn-outline bg-white"
          disabled={checkbox?.conclusion === "correct"}
          onClick={() => handleStatusSubmit("correct")}
        >
          ✅ Confirm
        </button>
        <button
          className="btn btn-sm btn-outline bg-white"
          disabled={checkbox?.conclusion === "critical"}
          onClick={() => handleStatusSubmit("critical")}
        >
          ❌ Raise
        </button>
        <button
          className="btn btn-sm btn-outline bg-white"
          disabled={checkbox?.conclusion === "acceptable"}
          onClick={() => handleStatusSubmit("acceptable")}
        >
          ⚠️ Warn
        </button>
        <button
          className="btn btn-sm btn-outline bg-white line-through"
          disabled={checkbox?.conclusion === "not applicable"}
          onClick={() => handleStatusSubmit("not applicable")}
        >
          Discard
        </button>
        <button
          className="btn btn-sm btn-outline bg-white"
          disabled={checkbox?.conclusion === undefined}
          onClick={() => handleStatusSubmit(undefined)}
        >
          Clear
        </button>
      </div>
    </div>
  );
};
