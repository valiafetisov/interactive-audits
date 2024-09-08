"use client";

import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { AuditList } from "~~/components/AuditList";
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
        <div className="h-36 mt-14 flex items-center">
          <div className="text-center">
            <h1 className="block italic text-5xl font-bold pb-0 mb-0">AuditTrail</h1>
            <div className="text-2xl text-neutral-500">Interactive checklists</div>
          </div>
        </div>
        <div className="flex-grow w-full px-8 space-y-4">
          <div>
            <h2 className="mt-10 flex items-center">
              <span className="text-xl font-bold mr-3">Your audit drafts</span>
            </h2>
            {hydrated ? (
              <>
                <DraftAuditList />
              </>
            ) : (
              <div className="flex items-center justify-center p-4 mb-2 bg-base-300">Loading...</div>
            )}
            <div className="flex justify-center">
              <button className="btn btn-primary h-auto text-base" onClick={createNewAudit}>
                <PlusCircleIcon className="w-6 h-6" />
                Create new draft from scratch
              </button>
            </div>
          </div>
          <div>
            <h2 className="">
              <span className="block text-xl font-bold">Last signed audits</span>
            </h2>
            {hydrated ? (
              <>
                <AuditList />
              </>
            ) : (
              <div className="flex items-center justify-center p-4 bg-base-300">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
