import { PublicKey } from "@solana/web3.js";

export interface IPool {
  address: PublicKey;
  totalStaked: number;
  totalOwed: number;
  slots: number[];
}
