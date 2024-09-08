import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Audit } from "~~/types";

/**
 * Zustand Draft Audit Store
 *
 * This stores the draft audits that the user is currently working on.
 *
 */

type AuditState = {
  audits: Audit[];
  draftAudits: Audit[];
  addAudit: (audit: Audit) => void;
  addDraftAudit: (audit: Audit) => void;
  removeDraftAudit: (id: string) => void;
  updateDraftAudit: (id: string, audit: Audit) => void;
};

const useDraftAuditState = create<AuditState>()(
  persist(
    set => ({
      audits: [],
      draftAudits: [],
      addAudit: audit => set(state => ({ audits: [...state.audits, audit] })),
      addDraftAudit: audit => set(state => ({ draftAudits: [...state.draftAudits, audit] })),
      removeDraftAudit: id => set(state => ({ draftAudits: state.draftAudits.filter(audit => audit.id !== id) })),
      updateDraftAudit: (id, updatedAudit) =>
        set(state => ({ draftAudits: state.draftAudits.map(audit => (audit.id === id ? updatedAudit : audit)) })),
    }),
    {
      name: "audits",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useHydrateDraftAudits = () => {
  const store = useDraftAuditState();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useDraftAuditState.persist.hasHydrated());
  }, []);

  return {
    ...store,
    hydrated,
  };
};
