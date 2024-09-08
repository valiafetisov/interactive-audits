"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SignProtocolClient } from "@ethsign/sp-sdk";
import type { WalletClient } from "viem";
import { useAccount } from "wagmi";
import AuditView from "~~/components/AuditView";
import { useHydrateDraftAudits } from "~~/services/store";
import type { Audit } from "~~/types";
import { notification } from "~~/utils/scaffold-eth";
import { createAttestation, getClient } from "~~/utils/signAttestation";
import { getWalletClient } from "~~/utils/wallet";

export default function DraftPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { draftAudits, updateDraftAudit } = useHydrateDraftAudits();
  const [draft, setDraft] = useState<Audit | undefined>();
  const { address } = useAccount();
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [client, setClient] = useState<SignProtocolClient | null>(null);
  const [isAttesting, setIsAttesting] = useState(false);

  useEffect(() => {
    const draft = draftAudits.find(audit => audit.id === id);
    setDraft(draft);
  }, [id, draftAudits]);

  useEffect(() => {
    const client = getWalletClient();
    setWalletClient(client);
  }, [address]);

  useEffect(() => {
    if (walletClient) {
      setClient(getClient(walletClient));
    }
  }, [walletClient]);

  function saveDraftAudit(audit: Audit) {
    updateDraftAudit(audit.id, audit);
    notification.success("Draft audit saved!");
  }

  async function attestAudit() {
    if (!client) {
      notification.error("Please connect your wallet");
      return;
    }

    if (!draft) {
      notification.error("Draft not found");
      return;
    }

    setIsAttesting(true);
    try {
      await createAttestation(draft.id, draft.data, client);
      notification.success("Attestation created");
      router.push(`/`);
    } catch (e) {
      console.error(e);
      notification.error("Attestation failed");
    }
    setIsAttesting(false);
  }

  return (
    <>
      {draft && (
        <div className="h-full space-y-2">
          {/* contents */}
          <AuditView audit={draft} saveAudit={saveDraftAudit} isAttesting={isAttesting} attestAudit={attestAudit} />
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
