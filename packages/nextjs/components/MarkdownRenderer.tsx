import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import "~~/styles/markdownRenderer.css";
import { Checkbox, parseMd, renderMd } from "~~/utils/md-parser";

interface MarkdownRendererProps {
  markdown: string;
}

interface ClickableListItemProps {
  children: React.ReactNode;
  isSelected: boolean;
  setSelectedKey: () => void;
}

function getKeyFromPosition(position: any) {
  return JSON.stringify({ start: position.start.line, end: position.end.line });
}

const ClickableListItem = ({ children, setSelectedKey, isSelected }: ClickableListItemProps) => {
  const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    setSelectedKey();
    console.log(`Clicked list item:`, event.currentTarget.textContent?.trim());
  };

  return (
    <li onClick={handleClick} className={`clickable-list-item ${isSelected ? "selected" : ""}`}>
      {children}
    </li>
  );
};

export const MarkdownRenderer = ({ markdown }: MarkdownRendererProps) => {
  const [selectedKey, setSelectedKey] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [checkboxes, setCheckboxes] = useState<Checkbox[]>([]);

  useEffect(() => {
    const fetchMarkdown = async () => {
      const { tree, currentCheckboxes } = await parseMd(markdown);
      const renderedMarkdown = await renderMd({ tree, checkboxes: currentCheckboxes });
      setMarkdownContent(renderedMarkdown);
    };
    fetchMarkdown();
  }, [markdown]);

  useEffect(() => {
    const fetchCheckboxes = async () => {
      const { currentCheckboxes } = await parseMd(markdownContent);
      setCheckboxes(currentCheckboxes);
    };
    fetchCheckboxes();
  }, [markdownContent]);

  const handleStatusSubmit = async (selectedStatus: Checkbox["conclusion"]) => {
    const updatedCheckboxes = checkboxes.map(checkbox => {
      const checkboxKey = getKeyFromPosition(checkbox.position);

      if (checkboxKey === selectedKey) {
        checkbox.conclusion = selectedStatus;
      }
      return checkbox;
    });

    // Update the markdown tree with the new checkboxes
    const { tree } = await parseMd(markdownContent);
    const renderedMarkdown = await renderMd({ tree, checkboxes: updatedCheckboxes });
    setMarkdownContent(renderedMarkdown); // Update the displayed markdown content
  };

  return (
    <div className="markdown-body">
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
        {markdownContent}
      </ReactMarkdown>

      {selectedKey && (
        <div className="w-[calc(100%-2rem)] flex fixed z-20 bottom-16 shadow-sm gap-2">
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
