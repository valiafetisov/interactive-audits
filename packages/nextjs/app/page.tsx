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
        <div className="h-32 flex items-center">
          <h1 className="text-center block text-4xl font-bold">Interactive On-chain Audits</h1>
        </div>
        <div className="flex-grow w-full bg-base-300 px-8 py-12 space-y-4">
          <h2 className="text-center">
            <span className="block text-2xl font-bold">Your drafts</span>
          </h2>
          {hydrated ? (
            <>
              <DraftAuditList />
              <button className="btn btn-primary btn-md rounded-full" onClick={createNewAudit}>
                <PlusCircleIcon className="w-6 h-6" />
                Create new audit from scratch
              </button>
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
