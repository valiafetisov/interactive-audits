"use client";

import { useEffect, useMemo, useState } from "react";
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
  const checklistsStatus = useMemo(() => {
    const { currentCheckboxes } = parseMd(markdown);
    return currentCheckboxes.reduce(
      (acc, checkbox) => {
        if (checkbox.conclusion === undefined) {
          return acc;
        } else {
          acc.completed += 1;
        }

        switch (checkbox.conclusion) {
          case "correct":
            acc.correct += 1;
            break;
          case "critical":
            acc.blockers += 1;
            break;
          case "acceptable":
            acc.warnings += 1;
            break;
          case "not applicable":
            acc.irrelevant += 1;
            break;
        }

        return acc;
      },
      { correct: 0, blockers: 0, warnings: 0, irrelevant: 0, total: currentCheckboxes.length, completed: 0 },
    );
  }, [markdown]);

  useEffect(() => {
    const fetchMarkdown = async () => {
      // parse the markdown checklist conclusions into emojis
      const { tree, currentCheckboxes } = parseMd(markdown);
      const renderedMarkdown = renderMd({ tree, checkboxes: currentCheckboxes });
      setMarkdown(renderedMarkdown);
    };
    fetchMarkdown();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  function switchTitleEditMode(isTitleEditMode: boolean) {
    if (isTitleEditMode) {
      setTitle(title);
    }
    setTitleEditMode(isTitleEditMode);
  }

  return (
    <div className="space-y-4 min-h-full">
      <div className="sticky top-0 bg-white z-30 px-8 pt-2 border-y-2">
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
              <button
                className="btn btn-sm font-bold w-36 border-primary border-2"
                onClick={() => setMode("editSource")}
              >
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

        <div className="w-full flex justify-between items-center">
          <p className="inline-block space-x-2">
            <span>
              {checklistsStatus.completed} checks completed (out of total {checklistsStatus.total}):
            </span>
            <span className="text-green-600">{checklistsStatus.correct} correct</span>
            <span className="text-red-600">{checklistsStatus.blockers} blockers</span>
            <span className="text-orange-500">{checklistsStatus.warnings} warnings</span>
            <span className="text-gray-500 line-through">{checklistsStatus.irrelevant} irrelevant</span>
            <span></span>
          </p>
          <button
            className="btn btn-primary btn-sm w-40 border-primary border-2"
            disabled={isAttesting || checklistsStatus.total !== checklistsStatus.completed}
            onClick={attestAudit}
          >
            <div className="flex gap-2">
              Sign Attestation
              {isAttesting && <ArrowPathIcon className="animate-spin h-5 w-5 inline-block" />}
            </div>
          </button>
        </div>
      </div>

      <div className="min-h-full mx-8">
        {mode === "fillIn" && <InteractiveMarkdownForm markdown={markdown} setMarkdown={setMarkdown} />}
        {mode === "editSource" && <MarkdownEditor value={markdown} onChange={(value: string) => setMarkdown(value)} />}
      </div>
    </div>
  );
};

export default AuditView;
