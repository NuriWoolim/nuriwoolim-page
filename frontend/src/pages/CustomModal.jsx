import Modal from "react-modal";
import { useEffect } from "react";
import styled from "styled-components";
const customStyles = {
  content: {
    position: "absolute",
    top: "0%",
    left: "0%",
    right: "0%",
    bottom: "0%",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
};
const CustomModal = (props) => {
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden"; // 스크롤 잠금
    } else {
      document.body.style.overflow = ""; // 원래대로
    }

    return () => {
      document.body.style.overflow = ""; // 모달이 언마운트될 때도 복원
    };
  }, [props.isOpen]);
  return (
    <Modal shouldCloseOnOverlayClick={true} {...props} style={customStyles}>
      {props.children}
    </Modal>
  );
};
export default CustomModal;
