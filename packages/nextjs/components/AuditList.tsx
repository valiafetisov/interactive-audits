import React from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useHydrateDraftAudits } from "~~/services/store";
import { notification } from "~~/utils/scaffold-eth";

/**
 * Audit list from user local storage
 */
export const AuditList = () => {
  const router = useRouter();
  const { draftAudits, removeDraftAudit } = useHydrateDraftAudits();

  function editAudit(id: string) {
    router.push(`/audit/${id}`);
  }

  function deleteAudit(id: string) {
    removeDraftAudit(id);
    notification.success("Audit deleted!");
  }

  return draftAudits.length === 0 ? (
    <div className="flex items-center justify-center p-4 bg-base-200 rounded-md my-2">
      <span className="text-gray-500">No audits found</span>
    </div>
  ) : (
    <div>
      {draftAudits.map(audit => {
        return (
          <div key={audit.id} className="flex items-center justify-between p-4 bg-base-200 rounded-md my-2">
            <span>{audit.title}</span>
            <div className="flex space-x-2">
              <button className="btn btn-secondary btn-sm" onClick={() => editAudit(audit.id)}>
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => deleteAudit(audit.id)}>
                <TrashIcon className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
