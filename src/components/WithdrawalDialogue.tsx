import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
} from "reactstrap";
import { IUser } from "../models/User";

export interface IStakeDialogueProps {
  show: boolean;
  user?: IUser;
  onClose: () => void;
  onWithdraw: (amount: number) => void;
}

const MIN_STAKE = 10;

const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const Note = styled.p`
  font-style: italic;
  font-weight: 300;
`;

const Error = styled.p`
  color: #c82333;
  margin: 5px 0;
`;

const Heading = styled.h5`
  width: 100%;
`;

const Option = styled.option`
  color: black;
`;

export const WithdrawalDialogue: React.FC<IStakeDialogueProps> = ({
  show,
  user,
  onClose,
  onWithdraw,
}) => {
  const [showing, setShowing] = useState(show);
  const [withdrawal, setWithdrawal] = useState<number | undefined>();

  useEffect(() => {
    setShowing(show);
  }, [show]);

  const handleWithdraw = () => {
    alert(`Calls ovr-program to request withdrawal of ${withdrawal} AOVR`);
    onWithdraw(withdrawal!);
    onClose();
  };

  const handleAovrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountString = e.target.value;
    const amount = Number(amountString) ?? 0;
    setWithdrawal(amount);
  };

  return (
    <Modal centered draggable isOpen={show}>
      <Container>
        <div className="modal-header">
          <Heading className="modal-title text-center">
            Request AOVR Withdrawal
          </Heading>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span
              aria-hidden="true"
              onClick={() => {
                setShowing(false);
                onClose();
              }}
            >
              &times;
            </span>
          </button>
        </div>
        <Container>
          {
            <>
              <Note>
                {`After requesting the withdrawal of some or all of your ${
                  user?.userStake ?? 0
                } AOVR it will take 1 week until you are
                able to claim your withdrawal. This measure is in place to
                prevent system manipulation`}
              </Note>

              <FormGroup row>
                <Label for="withdrawal">Withdrawal Amount</Label>
                <Input
                  id="withdrawal"
                  name="withdrawal"
                  placeholder="AOVR to withdraw"
                  type="number"
                  onChange={handleAovrChange}
                  bsSize="lg"
                  invalid={
                    !!withdrawal &&
                    (withdrawal < 0 || withdrawal > user!.userStake!)
                  }
                />
                <FormFeedback>Invalid amount</FormFeedback>
              </FormGroup>
              {withdrawal && (
                <Button
                  style={{ width: "100%", marginTop: "10px" }}
                  size="lg"
                  color="danger"
                  outline
                  onClick={handleWithdraw}
                >
                  {`Withdraw ${withdrawal} AOVR`}
                </Button>
              )}
              {!withdrawal && (
                <Button
                  style={{ width: "100%", marginTop: "10px" }}
                  disabled
                  size="lg"
                  color="danger"
                  outline
                >
                  {`Withdraw AOVR`}
                </Button>
              )}
            </>
          }
          {!user && <Error>Connect your Phantom wallet</Error>}
          {user && user?.solBalance! === 0 && (
            <Error>
              You do not have enough SOL to pay for the transaction fees related
              to staking on Solana
            </Error>
          )}
        </Container>
      </Container>
    </Modal>
  );
};
