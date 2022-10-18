import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Modal,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardLink,
} from "reactstrap";
import { AlertMessage } from "./Alert";
import { IPool } from "../models/Pool";
import { IUser } from "../models/User";
import { connectWallet } from "../web3/phantom";
import { getAovrBalance, getSolBalance } from "../web3/solana";
import { StakingInfo } from "./StakingInfo";
import { WalletStake } from "./WalletStake";
import { PhantomButton } from "./PhantomButton";
import { StakeDialogue } from "./StakeDialogue";
import { getRandomData } from "../web3/randomData";
import { Keypair } from "@solana/web3.js";

function App() {
  const [connectWalletMessage, setConnectWalletMessage] =
    useState<boolean>(false);

  const [addPoolMessage, setAddPoolMessage] = useState<boolean>(false);
  const [triggerInflationMessage, setTriggerInflationMessage] =
    useState<boolean>(false);
  const [showStakeDialogue, setShowStakeDialogue] = useState<boolean>(false);
  const [user, setUser] = useState<IUser>();
  const [pools, setPools] = useState<IPool[]>();

  useEffect(() => {
    setPools(getRandomData());
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    debugger;
    if (user) {
      return true;
    }
    const address = await connectWallet();
    if (address) {
      const aovrBalance = await getAovrBalance(address);
      const solBalance = await getSolBalance(address);

      setUser({
        solBalance: solBalance,
        aovrBalance: aovrBalance,
        address: address,
      });

      return true;
    }

    return false;
  };

  const initStake = () => {
    setShowStakeDialogue(true);
  };

  const handleStaked = (pool: string, slot: number, amount: number) => {
    let poolIndex = 0;
    let userStake = 0;
    const updatedPools = pools!.map((p, index) => {
      if (p.address.toString() === pool) {
        p.totalStaked += amount;
        p.slots[slot] += amount;
        poolIndex = index;
        userStake = p.slots[slot];
      }

      return p;
    });

    const updatedUser = {
      ...user!,
      aovrBalance: user!.aovrBalance - amount,
      stakeIndex: slot,
      stakePoolIndex: poolIndex,
      userStake,
    };

    setUser(updatedUser);
    setPools(updatedPools);
  };

  const onStakeDialogueClose = () => {
    setShowStakeDialogue(false);
  };

  const handleWithdrawal = (amount: number) => {
    const updatedUser = {
      ...user!,
      withdrawalRequestAmount: amount,
      withdrawalRequestDate: new Date(),
    };

    setUser(updatedUser);

    user!.withdrawalRequestAmount = amount;
    user!.withdrawalRequestDate = new Date();
  };

  const handleTriggerInflation = () => {
    const toDistribute = 10000;
    const totalStaked = pools!
      .map((p) => p.totalStaked + p.totalOwed)
      .reduce((p, c) => p + c);

    const updatedPools = pools?.map((p) => {
      const poolTotal = p.totalOwed + p.totalStaked;
      const shareOfTotalStaked = poolTotal / totalStaked;
      const shareOfReward = shareOfTotalStaked * toDistribute;
      return {
        ...p,
        totalOwed: p.totalOwed + shareOfReward,
      };
    });

    setPools(updatedPools);
    setTriggerInflationMessage(false);
  };

  const handleRegisterPool = () => {
    const newPool: IPool = {
      address: Keypair.generate().publicKey,
      totalStaked: 0,
      totalOwed: 0,
      slots: Array.from({ length: 100 }).map((d) => 0),
    };

    const updatedPools = [...pools!, newPool];

    setPools(updatedPools);
    setAddPoolMessage(false);
  };

  return (
    <div className="App container py-3">
      <div className="d-flex flex-row justify-content-between mb-5 ">
        <h1>ALLOVR AOVR Staking</h1>
        <PhantomButton connected={!!user} onClick={checkAuth} />
      </div>

      <div className="d-flex">
        {pools && <StakingInfo user={user} pools={pools}></StakingInfo>}
        {pools && user && (
          <WalletStake
            onWithdrawalRequest={handleWithdrawal}
            user={user}
            pools={pools}
          ></WalletStake>
        )}
      </div>

      <div className="container">
        <div className="d-flex flex-row-reverse">
          <div style={{ marginLeft: "10px" }}>
            <Button
              color="primary"
              className="mb-3"
              onClick={async () => {
                if (await checkAuth()) {
                  setAddPoolMessage(true);
                }
              }}
            >
              Register Pool
            </Button>
          </div>
          <Button
            color="primary"
            className="mb-3"
            onClick={async () => {
              if (await checkAuth()) {
                setTriggerInflationMessage(true);
              }
            }}
          >
            Trigger Inflation Run
          </Button>
        </div>
        <div className="row">
          {pools?.map((p, k) => (
            <div
              style={{
                width: "25%",
                padding: "5px",
              }}
              key={k}
            >
              <Card>
                <CardBody>
                  <CardTitle tag="h5">Pool {k}</CardTitle>

                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    Total Staked: {p.totalStaked} AOVR
                  </CardSubtitle>
                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    Total Owed: {p.totalOwed} AOVR
                  </CardSubtitle>
                  <CardSubtitle className="mb-2 text-muted" tag="h6">
                    Available Slots: {p.slots.filter((s) => s === 0).length}{" "}
                  </CardSubtitle>
                  <CardLink
                    href="#"
                    onClick={() => alert("Goes to solana explorer")}
                  >
                    {p.address.toString()}
                  </CardLink>
                  <div>
                    {p.totalOwed > 0 && (
                      <Button
                        className="m-1"
                        color="primary"
                        onClick={checkAuth}
                      >
                        Rebalance
                      </Button>
                    )}
                    {p.slots.filter((s) => s === 0).length > 0 && (
                      <Button
                        className="m-1"
                        color="danger"
                        onClick={initStake}
                      >
                        Stake
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <AlertMessage
        visible={connectWalletMessage}
        hide={() => setConnectWalletMessage(false)}
        title="Connect wallet"
        message="Connect your Phantom wallet"
      ></AlertMessage>

      <AlertMessage
        visible={addPoolMessage}
        hide={() => setAddPoolMessage(false)}
        title="Register Pool"
        message="No available pools/slots? Registering a new pool incurrs a small SOL cost"
        closeText="Cancel"
        confirmText="Register Pool"
        confirm={handleRegisterPool}
      ></AlertMessage>

      <AlertMessage
        visible={triggerInflationMessage}
        hide={() => setTriggerInflationMessage(false)}
        title="Trigger inflation run"
        message="Pending inflation run(s)? Triggering an inflation run incurrs a small SOL cost."
        closeText="Cancel"
        confirmText="Trigger Inflation Run"
        confirm={handleTriggerInflation}
      ></AlertMessage>

      {pools && (
        <StakeDialogue
          show={showStakeDialogue}
          user={user}
          onClose={onStakeDialogueClose}
          pools={pools!}
          onStake={handleStaked}
        ></StakeDialogue>
      )}
    </div>
  );
}

export default App;
