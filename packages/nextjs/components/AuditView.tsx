"use client";

import { useEffect, useState } from "react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { InteractiveMarkdownForm } from "~~/components/InteractiveMarkdownForm";
import { Audit } from "~~/types";
import { parseMd, renderMd } from "~~/utils/md-parser";

const AuditView = ({
  audit,
  saveAudit,
  attestAudit,
  isAttesting,
}: {
  audit: Audit;
  saveAudit: (audit: Audit) => void;
  attestAudit: () => void;
  isAttesting: boolean;
}) => {
  const [title, setTitle] = useState(audit.title);
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [markdown, setMarkdown] = useState(audit.data);
  const [mode, setMode] = useState<"fillIn" | "editSource">("fillIn");

  function switchTitleEditMode(isTitleEditMode: boolean) {
    if (isTitleEditMode) {
      setTitle(title);
    }
    setTitleEditMode(isTitleEditMode);
  }

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
    <div className="space-y-4 h-full">
      <div className="flex justify-between">
        {/* Title */}
        <div className="flex items-center gap-2">
          <span className="font-bold">Audit: </span>
          {titleEditMode && (
            <div className="flex flex-gap-3">
              <input
                type="text"
                className="border-2 rounded px-1"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <CheckCircleIcon
                className="w-7 h-7 ml-4 text-blue-400 hover:opacity-80"
                onClick={() => setTitleEditMode(false)}
              />
              <XCircleIcon
                className="w-7 h-7 text-red-400 hover:opacity-80"
                onClick={() => switchTitleEditMode(false)}
              />
            </div>
          )}
          {!titleEditMode && (
            <div className="flex gap-2 items-center">
              <span>{title}</span>
              <PencilSquareIcon
                className="w-6 h-6 text-blue-400 hover:opacity-80"
                onClick={() => switchTitleEditMode(true)}
              />
            </div>
          )}
        </div>

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
          <button
            disabled={titleEditMode}
            className="btn btn-primary btn-sm w-36 border-primary border-2"
            onClick={() => saveAudit({ ...audit, data: markdown, title })}
          >
            <CheckCircleIcon className="h-5 w-5 inline-block mr-1" />
            Save
          </button>
        </div>
      </div>

      {mode === "fillIn" && (
        <button
          className="btn btn-primary btn-sm w-40 border-primary border-2"
          disabled={isAttesting}
          onClick={attestAudit}
        >
          <div className="flex gap-2">
            Sign Attestation
            {isAttesting && <ArrowPathIcon className="animate-spin h-5 w-5 inline-block" />}
          </div>
        </button>
      )}

      <div className="h-full">
        {mode === "fillIn" && <InteractiveMarkdownForm markdown={markdown} setMarkdown={setMarkdown} />}
        {mode === "editSource" && <MarkdownEditor value={markdown} onChange={(value: string) => setMarkdown(value)} />}
      </div>
    </div>
  );
};

export default AuditView;
