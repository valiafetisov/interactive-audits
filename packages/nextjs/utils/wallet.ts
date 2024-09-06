import { createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";

export function getWalletClient() {
  if (typeof window !== "undefined" && window.ethereum) {
    return createWalletClient({
      chain: sepolia,
      transport: custom(window.ethereum),
    });
  }
  return null;
}
