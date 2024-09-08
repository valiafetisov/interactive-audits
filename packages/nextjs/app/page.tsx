"use client";

import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { DraftAuditList } from "~~/components/DraftAuditList";
import { useHydrateDraftAudits } from "~~/services/store";

const Home: NextPage = () => {
  const router = useRouter();
  const { addDraftAudit, hydrated } = useHydrateDraftAudits();

  function createNewAudit() {
    const defaultTitle = `Draft created at ${new Date().toLocaleDateString()}`;

    const id = crypto.randomUUID();
    addDraftAudit({
      id: id,
      title: defaultTitle,
      data: "",
      createdAt: new Date(),
    });

    router.push(`/draft/${id}`);
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow">
        <div className="h-56 flex items-center">
          <h1 className="text-center block text-4xl font-bold">AuditTrail – interactive checklists</h1>
        </div>
        <div className="flex-grow w-full px-8 py-12 space-y-4">
          <h2 className="flex items-center">
            <span className="text-xl font-bold mr-4">Your audit drafts</span>
            <button
              className="btn btn-primary rounded-full text-base p-1 pr-2 h-auto !min-h-2"
              onClick={createNewAudit}
            >
              <PlusCircleIcon className="w-6 h-6" />
              Create new draft from scratch
            </button>
          </h2>
          {hydrated ? (
            <>
              <DraftAuditList />
            </>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
