import { IPool } from "../models/Pool";
import { Keypair } from "@solana/web3.js";

export const getRandomData = (): IPool[] => {
  const p: IPool[] = [];
  for (let i = 0; i < 55; i++) {
    p.push({
      address: Keypair.generate().publicKey,
      totalStaked: Math.floor(Math.random() * 2060),
      totalOwed:
        Math.floor(Math.random() * 3) === 2
          ? 0
          : Math.floor(Math.random() * 200),
      slots: Array.from({ length: 100 }).map((d) =>
        Math.floor(Math.random() * 30) === 2
          ? 0
          : Math.floor(Math.random() * 200)
      ),
    });
  }
  return p;
};
