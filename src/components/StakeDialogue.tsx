import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Button,
  Col,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
} from "reactstrap";
import { IUser } from "../models/User";
import { IPool } from "../models/Pool";

export interface IStakeDialogueProps {
  show: boolean;
  user?: IUser;
  pools: IPool[];
  onClose: () => void;
  onStake: (pool: string, slot: number, amount: number) => void;
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

export const StakeDialogue: React.FC<IStakeDialogueProps> = ({
  show,
  user,
  pools,
  onClose,
  onStake,
}) => {
  const [showing, setShowing] = useState(show);
  const [aovrToStake, setAovrToStake] = useState<number | undefined>();
  const [pool, setPool] = useState<string | undefined>();
  const [slots, setSlots] = useState<number[] | undefined>();
  const [slot, setSlot] = useState<number | undefined>();

  useEffect(() => {
    setShowing(show);
  }, [show]);

  useEffect(() => {
    setPoolAndSlot(pools[0].address.toString());
  }, [pools]);

  const canStake = (): boolean =>
    // user?.aovrBalance! >= MIN_STAKE && user?.solBalance! > 0;
    !!user;

  const handleAovrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountString = e.target.value;
    const amount = Number(amountString) ?? 0;
    setAovrToStake(amount);
  };

  const setPoolAndSlot = (poolAddress: string) => {
    setPool(poolAddress);
    let availableSlots: number[] = [];
    const pool = pools.find((p) => p.address.toString() === poolAddress)!;
    for (let i = 0; i < pool.slots.length; i++) {
      if (pool.slots[i] === 0) {
        availableSlots.push(i);
      }
    }
    setSlots(availableSlots);
    setSlot(availableSlots[0]);
  };

  const handlePoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const poolAddress = e.target.value;
    setPoolAndSlot(poolAddress);
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slot = e.target.value;
    setSlot(Number(slot));
  };

  const handleStake = () => {
    alert(
      `Calls ovr-program to stake ${aovrToStake} AOVR to slot ${slot} of pool ${pool}`
    );
    onStake(pool!, slot!, aovrToStake!);
    onClose();
  };

  return (
    <Modal centered draggable isOpen={show}>
      <Container>
        <div className="modal-header">
          <Heading className="modal-title text-center">Stake AOVR</Heading>
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
          {canStake() && (
            <>
              <Note>
                Staking some or all of your {user?.aovrBalance ?? 0} AOVR will
                allow you to earn AOVR weekly. The minimum investment time is 1
                week, meaning you will not be able to withdraw your stake for 1
                week. The minimum stake is {MIN_STAKE} AOVR
              </Note>

              <FormGroup row>
                <Label for="availablePools">Available Pools</Label>
                <Input
                  bsSize="lg"
                  id="availablePools"
                  name="select"
                  type="select"
                  onChange={handlePoolChange}
                >
                  {pools
                    ?.filter((p) => p.slots.some((s) => s === 0))
                    .map((p) => (
                      <Option key={p.address.toString()}>
                        {p.address.toString()}
                      </Option>
                    ))}
                </Input>
              </FormGroup>

              <FormGroup row>
                <Label for="availableSlots">Available Pool Slots</Label>
                <Input
                  disabled={slots?.length! === 0}
                  bsSize="lg"
                  id="availableSlots"
                  name="select"
                  type="select"
                  onChange={handleSlotChange}
                >
                  {slots?.map((s) => (
                    <Option selected={slot === s} key={s}>
                      {s}
                    </Option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup row>
                <Label for="aovrStake">Stake</Label>
                <Input
                  id="aovrStake"
                  name="aovrStake"
                  placeholder="AOVR to Stake"
                  type="number"
                  onChange={handleAovrChange}
                  bsSize="lg"
                  invalid={
                    !!aovrToStake &&
                    (aovrToStake < MIN_STAKE ||
                      aovrToStake > (user?.aovrBalance ?? 0))
                  }
                />
                <FormFeedback>Invalid amount</FormFeedback>
              </FormGroup>
              {aovrToStake && pool && slot && (
                <Button
                  style={{ width: "100%", marginTop: "10px" }}
                  size="lg"
                  color="success"
                  outline
                  onClick={handleStake}
                >
                  {`Stake ${aovrToStake} AOVR`}
                </Button>
              )}
              {!(aovrToStake && pool && slot) && (
                <Button
                  style={{ width: "100%", marginTop: "10px" }}
                  disabled
                  size="lg"
                  color="success"
                  outline
                >
                  {`Stake AOVR`}
                </Button>
              )}
            </>
          )}
          {!user && <Error>Connect your Phantom wallet</Error>}
          {user && user.aovrBalance < MIN_STAKE && (
            <Error>You do not have enough AOVR to stake</Error>
          )}
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
