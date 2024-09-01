"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircleIcon, PencilSquareIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useHydrateDraftAudits } from "~~/services/store";
import type { Audit } from "~~/types";
import { notification } from "~~/utils/scaffold-eth";

export default function AuditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [titleEditMode, setTitleEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const { draftAudits, updateDraftAudit } = useHydrateDraftAudits();
  const [audit, setAudit] = useState<Audit | undefined>();

  useEffect(() => {
    const audit = draftAudits.find(audit => audit.id === id);
    setAudit(audit);
  }, [id, draftAudits]);

  function saveTitle() {
    if (!audit) {
      console.error("Audit not found");
      return;
    }

    setTitleEditMode(false);
    setAudit({ ...audit, title: editedTitle });
  }

  function saveAudit() {
    if (!audit) {
      console.error("Audit not found");
      return;
    }

    updateDraftAudit(audit.id, audit);
    notification.success("Audit saved!");
    router.push(`/`);
  }

  function switchTitleEditMode(isTitleEditMode: boolean) {
    if (!audit) {
      console.error("Audit not found");
      return;
    }

    if (isTitleEditMode) {
      setEditedTitle(audit.title);
    }
    setTitleEditMode(isTitleEditMode);
  }

  return (
    <>
      {audit && (
        <div className="px-8 py-12 space-y-2">
          <div className="flex justify-between">
            {/* Title */}
            {titleEditMode && (
              <div className="flex flex-gap-3">
                <input
                  type="text"
                  className="border-2 rounded px-1"
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                />
                <CheckCircleIcon className="w-7 h-7 ml-4 text-blue-400 hover:opacity-80" onClick={saveTitle} />
                <XCircleIcon
                  className="w-7 h-7 text-red-400 hover:opacity-80"
                  onClick={() => switchTitleEditMode(false)}
                />
              </div>
            )}
            {!titleEditMode && (
              <div className="flex gap-2 items-center">
                <span>{audit.title}</span>
                <PencilSquareIcon
                  className="w-6 h-6 text-blue-400 hover:opacity-80"
                  onClick={() => switchTitleEditMode(true)}
                />
              </div>
            )}
            <button disabled={titleEditMode} className="btn btn-primary btn-sm" onClick={saveAudit}>
              Save
            </button>
          </div>
          {/* contents */}
          <textarea
            className="w-full h-96 border-2 rounded px-1"
            value={audit.data}
            onChange={e => setAudit({ ...audit, data: e.target.value })}
          />
        </div>
      )}
      {!audit && (
        <div className="px-8 py-12">
          <div className="text-center">
            <span className="block text-2xl font-bold">Audit not found</span>
            <button className="btn btn-primary mt-4" onClick={() => router.push("/")}>
              Back to home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
