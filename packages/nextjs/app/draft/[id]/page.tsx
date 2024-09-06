"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuditView from "~~/components/AuditView";
import { useHydrateDraftAudits } from "~~/services/store";
import type { Audit } from "~~/types";
import { notification } from "~~/utils/scaffold-eth";

export default function DraftPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { draftAudits, updateDraftAudit } = useHydrateDraftAudits();
  const [draft, setDraft] = useState<Audit | undefined>();

  useEffect(() => {
    const draft = draftAudits.find(audit => audit.id === id);
    setDraft(draft);
  }, [id, draftAudits]);

  function saveDraftAudit(audit: Audit) {
    updateDraftAudit(audit.id, audit);
    notification.success("Draft audit saved!");
    router.push(`/`);
  }

  return (
    <>
      {draft && (
        <div className="px-8 py-12 space-y-2">
          {/* contents */}
          <AuditView audit={draft} saveAudit={saveDraftAudit} />
        </div>
      )}
      {!draft && (
        <div className="px-8 py-12">
          <div className="text-center">
            <span className="block text-2xl font-bold">Draft audit not found</span>
            <button className="btn btn-primary mt-4" onClick={() => router.push("/")}>
              Back to home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
