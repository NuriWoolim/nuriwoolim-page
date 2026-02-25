import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DraggableTable from "./DraggableTable";
import { TimeTableAPI } from "../../apis/common";
import { TTColors } from "../../data/CalendarData";
import CustomColorPicker from "./CustomColorPicker";

const SLOT_COUNT = 13; // 13 hourly slots: 9-10, 10-11, ..., 21-22

/* ── Layout ── */
const Container = styled.div`
  display: flex;
  width: 36rem;
  * {
    box-sizing: border-box;
    font-family: "Pretendard", sans-serif;
  }
`;

const LeftPanel = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const RightPanel = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #333;
  min-width: 0;
`;

/* ── Header Bars ── */
const HeaderBar = styled.div`
  background-color: #486284;
  height: 3.1rem;
  display: flex;
  align-items: center;
  padding: 0 0.9rem;
  flex-shrink: 0;
`;

const LeftHeader = styled(HeaderBar)`
  justify-content: space-between;
`;

const RightHeader = styled(HeaderBar)`
  justify-content: center;
  padding: 0 0.6rem;
`;

const HeaderTitle = styled.h2`
  color: #fff;
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.02em;
`;

const CloseButton = styled.button`
  background: url("/assets/close_button.svg") no-repeat center;
  background-size: 1.1rem;
  box-sizing: content-box;
  width: 1.12rem;
  height: 1.12rem;
  padding: 0.45rem;
  border: none;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    opacity: 0.7;
  }
`;

/* ── Right Panel Form ── */
const FormContainer = styled.div`
  flex: 1;
  background: #fff7e2;
  display: flex;
  flex-direction: column;
  padding: 1.8rem 1.3rem 1.5rem;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  color: #486284;
  font-size: 0.96rem;
  font-weight: 800;
  margin: 0 0 0.35rem 0;
  letter-spacing: -0.02em;
  text-align: ${(p) => (p.$center ? "center" : "left")};
`;

const GuideText = styled.p`
  color: #486284;
  font-size: 0.72rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.55;
  margin: 0 0 1.5rem 0;
`;

const FieldGroup = styled.div`
  margin-bottom: 1.2rem;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  box-shadow: 1px 1px 4.1px 0 rgba(72, 98, 132, 0.2) inset;
  height: 2.3rem;
  padding: 0 0.6rem;
  font-size: 0.85rem;
  font-family: "Pretendard", sans-serif;
  background: #fff;
  outline: none;
  margin-top: 0.3rem;
`;

const BottomArea = styled.div`
  margin-top: auto;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.75rem 0;
  background: ${(p) => (p.disabled ? "#999" : "#486284")};
  border: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: "Pretendard", sans-serif;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  box-shadow: 1.4px 1.4px 4.2px 0 rgba(0, 0, 0, 0.15) inset;
  letter-spacing: -0.02em;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:active:not(:disabled) {
    opacity: 0.8;
  }
`;

const LoginHint = styled.p`
  color: #863d3d;
  font-size: 0.72rem;
  font-weight: 600;
  text-align: right;
  margin: 0.35rem 0 0 0;
`;

const ErrorMsg = styled.p`
  color: #c0392b;
  font-size: 0.75rem;
  text-align: center;
  margin: 0 0 0.5rem 0;
`;

/* ── Helpers ── */
function padTwo(n) {
  return String(n).padStart(2, "0");
}

/* ── Component ── */
const DetailedDate = ({ dateObj, getMonthTimeTables, onClose }) => {
  const isLogged = localStorage.getItem("accessToken") !== null;

  // 13 hourly slots
  const [cells, setCells] = useState(
    Array.from({ length: SLOT_COUNT }, () => ({ isSelected: false }))
  );

  const [timetableData, setTimetableData] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [songName, setSongName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TTColors[0][0]);
  const [errorMsg, setErrorMsg] = useState("");

  /* ── Fetch existing timetables for this date ── */
  const fetchTimetables = async () => {
    try {
      const dateStr = `${dateObj.getFullYear()}-${padTwo(dateObj.getMonth() + 1)}-${padTwo(dateObj.getDate())}`;
      const from = `${dateStr}T00:00`;
      const to = `${dateStr}T23:59`;
      const result = await TimeTableAPI.getTimeTable(from, to);
      const data = result?.data?.data ?? [];
      setTimetableData(data);
    } catch (error) {
      console.log("fetchTimetables error", error);
      setTimetableData([]);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  /* ── Get the selected time range from cells ── */
  const getSelectedRange = () => {
    let first = -1;
    let last = -1;
    let isContiguous = true;

    cells.forEach((cell, i) => {
      if (cell.isSelected) {
        if (first === -1) first = i;
        else if (i > last + 1) isContiguous = false;
        last = i;
      }
    });

    if (first === -1) return null;
    return {
      startHour: 9 + first,
      endHour: 9 + last + 1,
      count: last - first + 1,
      isContiguous,
    };
  };

  /* ── Validation ── */
  const validate = () => {
    const range = getSelectedRange();
    if (!range) return "시간을 선택해주세요.";
    if (!range.isContiguous) return "연속된 시간을 선택해주세요.";
    if (range.endHour <= range.startHour)
      return "종료 시간이 시작 시간보다 빨라야 합니다.";
    if (range.count > 2) return "총 시간이 2시간을 초과할 수 없습니다.";

    // Check overlap with existing timetables
    for (const tt of timetableData) {
      const ttStart = parseInt(tt.start.split("T")[1].split(":")[0]);
      const ttEnd = parseInt(tt.end.split("T")[1].split(":")[0]);
      if (range.startHour < ttEnd && range.endHour > ttStart) {
        return "선택한 시간이 기존 일정과 겹칩니다.";
      }
    }

    if (!teamName.trim()) return "팀명을 입력해주세요.";
    if (!songName.trim()) return "곡 이름을 입력해주세요.";

    return null;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    setErrorMsg("");
    const error = validate();
    if (error) {
      alert(error);
      setErrorMsg(error);
      return;
    }

    const range = getSelectedRange();
    const dateStr = `${dateObj.getFullYear()}-${padTwo(dateObj.getMonth() + 1)}-${padTwo(dateObj.getDate())}`;

    const data = {
      title: songName.trim(),
      team: teamName.trim(),
      description: "",
      color: selectedColor.replace("#", ""),
      start: `${dateStr}T${padTwo(range.startHour)}:00`,
      end: `${dateStr}T${padTwo(range.endHour)}:00`,
    };

    try {
      await TimeTableAPI.createTimeTable(data);
      await fetchTimetables();
      if (typeof getMonthTimeTables === "function") getMonthTimeTables();

      // Reset form
      setCells(
        Array.from({ length: SLOT_COUNT }, () => ({ isSelected: false }))
      );
      setTeamName("");
      setSongName("");
      setErrorMsg("");
    } catch (error) {
      const msg =
        error.response?.data?.message || "합주 생성 중 오류가 발생했습니다.";
      alert(msg);
      setErrorMsg(msg);
    }
  };

  /* ── Render ── */
  return (
    <Container data-testid="DetailedDate">
      <LeftPanel>
        <LeftHeader>
          <CloseButton onClick={onClose} />
          <HeaderTitle>
            {dateObj.getMonth() + 1}/{dateObj.getDate()}
          </HeaderTitle>
        </LeftHeader>
        <DraggableTable
          cells={cells}
          setCells={setCells}
          timetableData={timetableData}
        />
      </LeftPanel>

      <RightPanel>
        <RightHeader>
          <HeaderTitle>합주 생성 및 편집하기</HeaderTitle>
        </RightHeader>
        <FormContainer>
          <SectionTitle $center>이용 안내</SectionTitle>
          <GuideText>
            좌측 시트에서 원하는 시간 드래그 후,
            <br />
            우측 정보란에 해당하는 정보 입력한 뒤
            <br />
            하단의 합주 생성하기 버튼을 눌러주시면 됩니다.
          </GuideText>

          <FieldGroup>
            <SectionTitle>팀명</SectionTitle>
            <TextInput
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <SectionTitle>곡 이름</SectionTitle>
            <TextInput
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <SectionTitle>팀 색상</SectionTitle>
            <CustomColorPicker
              colors={TTColors.map((x) => x[0])}
              color={selectedColor}
              onChange={setSelectedColor}
            />
          </FieldGroup>

          <BottomArea>
            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}
            <SubmitBtn onClick={handleSubmit} disabled={!isLogged}>
              합주 생성하기
            </SubmitBtn>
            {!isLogged && <LoginHint>로그인 후 이용하세요!</LoginHint>}
          </BottomArea>
        </FormContainer>
      </RightPanel>
    </Container>
  );
};

export default DetailedDate;

// Keep exports for backward compatibility (used by TTDataDisplay)
export const CREATE = 0;
export const READ = 1;
export const UPDATE = 2;
export const TIMELIMIT = 4;
