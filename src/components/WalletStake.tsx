import React, { useEffect, useState } from "react";
import { IPool } from "../models/Pool";
import { IUser } from "../models/User";
import styled from "styled-components";
import { Button } from "reactstrap";
import { WithdrawalDialogue } from "./WithdrawalDialogue";

export interface IWalletStakeProps {
  pools: IPool[];
  user?: IUser;
  onWithdrawalRequest: (amount: number) => void;
}

const Container = styled.div`
  width: 100%;
  text-align: right;
`;

const Info = styled.div``;

const Heading = styled.h4`
  margin: 20px 0;
`;

export const WalletStake: React.FC<IWalletStakeProps> = ({
  user,
  pools,
  onWithdrawalRequest,
}) => {
  const [showWithdraw, setShowWithdraw] = useState(false);

  const addDays = (date: Date, days: number): Date => {
    date.setDate(date.getDate() + days);
    return date;
  };

  return (
    <Container className="d-flex flex-column align-items-end mb-5 ">
      {user && (
        <>
          <div>
            <Heading>Wallet Balances</Heading>
            <Info>
              <a
                target={"_blank"}
                href={`https://explorer.solana.com/address/${user.address.toString()}`}
              >
                {user.address.toString()}
              </a>
            </Info>
          </div>
          <div>
            <Info>{`${user?.solBalance} SOL`}</Info>
          </div>
          <div>
            <Info>{`${user?.aovrBalance} AOVR`}</Info>
          </div>
          <div>
            <Heading>Staking</Heading>
            <Info>{`${user?.userStake ?? 0} AOVR`}</Info>
          </div>
          {user?.stakePoolIndex! >= 0 && (
            <>
              <Info>{`Pool Index (address below): ${user.stakePoolIndex}`}</Info>
              <Info>
                <a
                  target={"_blank"}
                  href={`https://explorer.solana.com/address/${pools[
                    user.stakePoolIndex!
                  ].address.toString()}`}
                >
                  {user.address.toString()}
                </a>
              </Info>
              <div>
                <Info>{`Slot: ${user.stakeIndex}`}</Info>
              </div>
              {user.withdrawalRequestAmount && (
                <>
                  <Heading>Withdrawal Request</Heading>
                  <Info>{`Amount: ${
                    user.withdrawalRequestAmount ?? 0
                  } AOVR`}</Info>
                  <Info>{`Claim after: ${addDays(
                    user.withdrawalRequestDate!,
                    7
                  )}`}</Info>
                </>
              )}
              {user?.userStake! > 0 && !user?.withdrawalRequestAmount && (
                <div>
                  <Button
                    size="lg"
                    color="danger"
                    outline
                    onClick={() => setShowWithdraw(true)}
                  >
                    Request Withdrawal
                  </Button>
                </div>
              )}

              {user.withdrawalRequestAmount && (
                <div>
                  <Button
                    size="lg"
                    color="danger"
                    outline
                    onClick={() => alert("Cencl")}
                  >
                    Cancel Withdrawal Request
                  </Button>
                </div>
              )}
            </>
          )}
          <WithdrawalDialogue
            onClose={() => setShowWithdraw(false)}
            onWithdraw={onWithdrawalRequest}
            show={showWithdraw}
            user={user}
          ></WithdrawalDialogue>
        </>
      )}
    </Container>
  );
};
