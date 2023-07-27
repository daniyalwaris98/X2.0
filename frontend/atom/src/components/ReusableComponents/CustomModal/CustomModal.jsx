import React from "react";
import { CustomModalStyle } from "./CustomModel.style";

function CustomModal(props) {
  const { children, isModalOpen, setIsModalOpen } = props;

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <CustomModalStyle
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered={true}
      {...props}
    >
      {children}
    </CustomModalStyle>
  );
}

export default CustomModal;
