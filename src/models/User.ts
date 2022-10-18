import { PublicKey } from "@solana/web3.js";

export interface IUser {
  solBalance: number;
  aovrBalance: number;
  stakePoolIndex?: number;
  stakeIndex?: number;
  userStake?: number;
  address: PublicKey;
  withdrawalRequestAmount?: number;
  withdrawalRequestDate?: Date;
}
