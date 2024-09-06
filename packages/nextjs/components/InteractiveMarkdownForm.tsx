import { useEffect, useRef, useState } from "react";
import { Root } from "mdast";
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
  const [selectedKey, setSelectedKey] = useState("");
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);
  const [tree, setTree] = useState<Root | null>(null);
  const prevMarkdownRef = useRef("");

  useEffect(() => {
    // Only re-parse the markdown when it was changed
    if (markdown === prevMarkdownRef.current) return;
    const fetchMarkdown = async () => {
      const { tree: currentTree, currentCheckboxes } = await parseMd(markdown);
      setTree(currentTree);
      setCheckboxes(currentCheckboxes);
    };
    fetchMarkdown();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown, setMarkdown]);

  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!tree) return; // tree should exist at this point
      const renderedMarkdown = await renderMd({ tree, checkboxes });
      setMarkdown(renderedMarkdown);
      prevMarkdownRef.current = renderedMarkdown;
    };
    fetchMarkdown();
  }, [checkboxes, setMarkdown, tree]);

  const handleStatusSubmit = (selectedStatus: Checkbox["conclusion"]) => {
    const updatedCheckboxes = checkboxes.map(checkbox => {
      const checkboxKey = getKeyFromPosition(checkbox.position);
      if (checkboxKey === selectedKey) {
        checkbox.conclusion = selectedStatus;
      }
      return checkbox;
    });
    console.log(updatedCheckboxes);
    setCheckboxes(updatedCheckboxes);
  };

  return (
    <div onClick={() => setSelectedKey("")} className="markdown-body bg-white p-2 h-full">
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
              <ClickableListItem setSelectedKey={() => setSelectedKey(key)} isSelected={selectedKey === key}>
                {children}
              </ClickableListItem>
            );
          },
          // Other markdown elements will use default rendering
        }}
      >
        {markdown}
      </ReactMarkdown>

      {selectedKey && (
        <div className="w-[calc(100%-2rem)] flex fixed z-20 bottom-16 gap-2">
          <button className="btn btn-sm btn-outline bg-white" onClick={() => handleStatusSubmit("correct")}>
            Correct
          </button>
          <button className="btn btn-sm btn-outline bg-white" onClick={() => handleStatusSubmit("critical")}>
            Critical
          </button>
          <button className="btn btn-sm btn-outline bg-white" onClick={() => handleStatusSubmit("acceptable")}>
            Acceptable
          </button>
          <button className="btn btn-sm btn-outline bg-white" onClick={() => handleStatusSubmit("not applicable")}>
            Not Applicable
          </button>
        </div>
      )}
    </div>
  );
};
