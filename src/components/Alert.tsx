import React from "react";
import { Button } from "reactstrap";
import Modal from "reactstrap/es/Modal";
import styled from "styled-components";

export interface IAlertProps {
  visible: boolean;
  message?: string;
  title?: string;
  confirmText?: string;
  closeText?: string;
  hide: () => void;
  confirm?: () => void;
}

const ButtonContainer = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 10px;
`;

export const AlertMessage: React.FC<IAlertProps> = ({
  visible = false,
  message,
  title,
  hide,
  confirm,
  confirmText = "OK",
  closeText = "Close",
}) => {
  return (
    <>
      <Modal isOpen={visible}>
        <div style={{ padding: "20px" }}>
          <h4>{title}</h4>
          <div>{message}</div>
          <ButtonContainer>
            <Button size="lg" color="danger" outline onClick={hide}>
              {closeText}
            </Button>
            {confirm && (
              <Button size="lg" color="success" outline onClick={confirm}>
                {confirmText}
              </Button>
            )}
          </ButtonContainer>
        </div>
      </Modal>
    </>
  );
};
