"use client";

import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { AuditList } from "~~/components/AuditList";
import { useHydrateDraftAudits } from "~~/services/store";

const Home: NextPage = () => {
  const router = useRouter();
  const { draftAudits, addDraftAudit, hydrated } = useHydrateDraftAudits();

  function createNewAudit() {
    const defaultTitle = "Untitled_Audit";

    const numbers = draftAudits.map(audit => {
      const match = audit.id.match(/audit_(\d+)/);
      return match ? parseInt(match[1], 10) : -1;
    });

    const nextId = numbers.length ? Math.max(...numbers) + 1 : 1;

    const id = `audit_${nextId.toString()}`;
    addDraftAudit({
      id: id,
      title: defaultTitle,
      data: "",
      createdAt: new Date().toISOString(),
    });

    router.push(`/audit/${id}`);
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Interactive On-chain Audits</span>
          </h1>
        </div>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12 space-y-4">
          <h2 className="text-center">
            <span className="block text-2xl font-bold">Your audits</span>
          </h2>
          {hydrated ? (
            <>
              <AuditList />
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
