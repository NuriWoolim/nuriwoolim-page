import React, { useState } from "react";
import styled from "styled-components";
import { changePassword } from "../../apis/user";

const Page = styled.div`
  min-height: calc(100vh - 85px);
  background: #fefaef;
  padding: 48px 24px;
`;

const Card = styled.div`
  max-width: 520px;
  margin: 0 auto;
  border: 2px solid #033148;
  background: white;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 20px 0;
  color: #033148;
`;

const Field = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #486284;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #b8c1cb;
  padding: 10px 12px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #033148;
  color: #fff;
  border: none;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-bottom: 14px;
  color: ${({ $error }) => ($error ? "#c0392b" : "#2e7d60")};
  font-size: 13px;
`;

const PASSWORD_RULE = /^(?=.*[0-9])(?=.*[A-Za-z]).{8,20}$/;

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setMessage("");
    setIsError(false);

    if (!PASSWORD_RULE.test(newPassword)) {
      setIsError(true);
      setMessage("새 비밀번호는 영문/숫자를 포함한 8~20자여야 합니다.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setIsError(true);
      setMessage("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      setMessage("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "비밀번호 변경에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page>
      <Card>
        <Title>비밀번호 변경</Title>
        {message && <Message $error={isError}>{message}</Message>}
        <Field>
          <Label>현재 비밀번호</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </Field>
        <Field>
          <Label>새 비밀번호</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </Field>
        <Field>
          <Label>새 비밀번호 확인</Label>
          <Input
            type="password"
            value={newPasswordConfirm}
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
          />
        </Field>
        <SubmitButton
          onClick={handleSubmit}
          disabled={
            !currentPassword || !newPassword || !newPasswordConfirm || isSubmitting
          }
        >
          {isSubmitting ? "변경 중..." : "비밀번호 변경"}
        </SubmitButton>
      </Card>
    </Page>
  );
};

export default ChangePassword;
