import React from "react";
import { useHydrateDraftAudits } from "~~/services/store";

/**
 * Audit list from user local storage
 */
export const AuditList = () => {
  const { audits } = useHydrateDraftAudits();

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
          </div>
        );
      })}
    </div>
  );
};
