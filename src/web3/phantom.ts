import { PublicKey, Transaction } from "@solana/web3.js";

export type DisplayEncoding = "utf8" | "hex";
export type PhantomEvent = "disconnect" | "connect" | "accountChanged";
export type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

export interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    // @ts-ignore
    const provider = window.solana as any;
    if (provider.isPhantom) return provider as PhantomProvider;
  }

  window.open("https://phantom.app/", "_blank");
};

export const connectWallet = async (): Promise<PublicKey | undefined> => {
  if (!getProvider()) {
    return undefined;
  }

  // @ts-ignore
  const { solana } = window;

  if (solana) {
    try {
      const response = await solana.connect();
      return new PublicKey(response.publicKey);
    } catch (err) {
      alert(((err as any)?.message as string) ?? "Error connecting to Phantom");
    }
  }
};
