import {
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const AOVR_MINT: PublicKey = new PublicKey(
  "Aovr4TdVH6qtZHcv4og6CLqn7gjNYtmDRQULYZSTz1Qf"
);

const getConnection = () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  return connection;
};

export const getSolBalance = async (publicKey: PublicKey): Promise<number> => {
  const connection = getConnection();
  const lamports = await connection.getBalance(publicKey);
  return lamports / LAMPORTS_PER_SOL;
};

export const getAovrBalance = async (publicKey: PublicKey) => {
  const connection = getConnection();
  const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
    mint: AOVR_MINT,
  });

  let balance = 0;
  for (const tokenAccount of response?.value) {
    const tokenAmount = await connection.getTokenAccountBalance(
      tokenAccount.pubkey
    );
    balance += tokenAmount.value.uiAmount ?? 0;
  }

  return balance;
};
