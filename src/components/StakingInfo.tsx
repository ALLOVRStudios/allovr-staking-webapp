import React from "react";
import { IPool } from "../models/Pool";
import { IUser } from "../models/User";
import styled from "styled-components";

export interface IStakingInfoProps {
  pools: IPool[];
  user?: IUser;
}

const Container = styled.div`
  width: 100%;
`;

export const StakingInfo: React.FC<IStakingInfoProps> = ({ user, pools }) => {
  const numberOfPools = pools.length;
  const totalStaked = pools
    .map((p) => p.totalStaked + p.totalOwed)
    .reduce((p, c) => p + c);
  const numberOfStakes = pools
    .map((p) => p.slots.filter((s) => s > 0).length)
    .reduce((p, c) => p + c);

  return (
    <Container className="d-flex flex-column align-items-start mb-5 ">
      <div>
        <h4>{`Total Staked: ${totalStaked} AOVR`}</h4>
      </div>
      <div>
        <h4>{`Pools: ${numberOfPools}`}</h4>
      </div>
      <div>
        <h4>{`Stakes: ${numberOfStakes}`}</h4>
      </div>
    </Container>
  );
};
