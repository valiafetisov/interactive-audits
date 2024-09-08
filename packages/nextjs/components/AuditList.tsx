import React from "react";
import { useRouter } from "next/navigation";
import { ViewfinderCircleIcon } from "@heroicons/react/24/outline";
import { useHydrateDraftAudits } from "~~/services/store";

/**
 * Audit list from user local storage
 */
export const AuditList = () => {
  const router = useRouter();
  const { audits } = useHydrateDraftAudits();

  function editAudit(id: string) {
    router.push(`/audit/${id}`);
  }

  return audits.length === 0 ? (
    <div className="flex items-center justify-center p-4 bg-base-200 rounded-md my-2">
      <span className="text-gray-500">No audits found</span>
    </div>
  ) : (
    <div>
      {audits.map(audit => {
        return (
          <div key={audit.id} className="flex items-center justify-between p-4 bg-base-200 rounded-md my-2">
            <span>{audit.title}</span>
            <div className="flex space-x-2">
              <button className="btn btn-secondary btn-sm" onClick={() => editAudit(audit.id)}>
                <ViewfinderCircleIcon className="h-4 w-4" />
                View
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
