import { EvmChains, SignProtocolClient, SpMode } from "@ethsign/sp-sdk";
import { keccak256, toHex } from "viem";
import type { WalletClient } from "viem";

// https://testnet-scan.sign.global/schema/onchain_evm_11155111_0x120
const ATTESTATION_SCHEMA_ID = "0x120";

export function getClient(walletClient: WalletClient) {
  return new SignProtocolClient(SpMode.OnChain, {
    chain: EvmChains.sepolia,
    walletClient,
  });
}

export function createAttestation(id: string, text: string, client: SignProtocolClient) {
  const hash = keccak256(toHex(text));
  return client.createAttestation({
    schemaId: ATTESTATION_SCHEMA_ID,
    data: { title: "a", hash },
    indexingValue: id,
  });
}
