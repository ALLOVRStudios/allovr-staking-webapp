import React from "react";
import styled from "styled-components";

interface IStyleProps {
  connected: boolean;
}

const Container = styled.div<IStyleProps>`
  cursor: ${(props) => (props.connected ? "pointer" : "default")};
  height: 50px;
  display: flex;
  background-color: #232323;
  border: rgba(255, 255, 255, 0.125) 1px solid;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  text-align: right;
  white-space: nowrap;
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

export const PhantomButton: React.FC<{
  onClick: () => void;
  connected: boolean;
}> = ({ onClick, connected }) => {
  const handleOnClick = () => !connected && onClick();

  return (
    <Container onClick={handleOnClick} connected>
      <Icon src="phantom.png"></Icon>
      <div>{connected ? "Connected" : "Connect Phantom Wallet"}</div>
    </Container>
  );
};
