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
  width: 45rem;
  height: 55rem;
  * {
    box-sizing: border-box;
    font-family: "Pretendard", sans-serif;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #333;
  min-width: 0;
`;

/* ── Header Bars ── */
const HeaderBar = styled.div`
  background-color: #486284;
  height: 3.9rem;
  display: flex;
  align-items: center;
  padding: 0 1.1rem;
  flex-shrink: 0;
`;

const LeftHeader = styled(HeaderBar)`
  justify-content: space-between;
`;

const RightHeader = styled(HeaderBar)`
  justify-content: flex-end;
  padding: 0 0.75rem;
`;

const HeaderTitle = styled.h2`
  color: #FFF7E2;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
  letter-spacing: -0.02em;
`;

const CloseButton = styled.button`
  background: url("/assets/close_button.svg") no-repeat center;
  background-size: 1.4rem;
  box-sizing: content-box;
  width: 1.4rem;
  height: 1.4rem;
  padding: 0;
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
  padding: 2.25rem 1.6rem 1.9rem;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  color: #486284;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 0.44rem 0;
  letter-spacing: -0.02em;
  text-align: ${(p) => (p.$center ? "center" : "left")};
`;

const GuideText = styled.p`
  color: #486284;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.25;
  margin: 0 0 1.9rem 0;
`;

const FieldGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  box-shadow: 1px 1px 4.1px 0 rgba(72, 98, 132, 0.2) inset;
  height: 2.9rem;
  padding: 0 0.75rem;
  font-size: 1.05rem;
  font-family: "Pretendard", sans-serif;
  background: #fff;
  outline: none;
  margin-top: 0.375rem;
`;

const HintText = styled.p`
  color: #c0392b;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: right;
  margin: 0.3rem 0 0 0;
`;

const BottomArea = styled.div`
  margin-top: 1.2rem;
`;

const DeleteBtnWrapper = styled.div`
  margin-top: auto;
  padding-top: 0.6rem;
  display: flex;
  justify-content: flex-end;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.94rem 0;
  background: #486284;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: "Pretendard", sans-serif;
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  box-shadow: ${(p) =>
    p.disabled
      ? "3.12px 3.12px 11.94px 0px #00000033 inset"
      : "1.4px 1.4px 4.2px 0 rgba(0, 0, 0, 0.15) inset"};
  letter-spacing: -0.02em;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:active:not(:disabled) {
    opacity: 0.8;
  }
`;

const DeleteBtn = styled.button`
  padding: 0.56rem 1.25rem;
  background: #863d3d;
  border: none;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  font-family: "Pretendard", sans-serif;
  cursor: pointer;
  letter-spacing: -0.02em;
  float: right;
  margin-top: 0.6rem;

  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.8;
  }
`;

const LoginHint = styled.p`
  color: #863d3d;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
  margin: 0.44rem 0 0 0;
`;

const ErrorMsg = styled.p`
  color: #c0392b;
  font-size: 0.94rem;
  text-align: center;
  margin: 0 0 0.625rem 0;
`;

/* ── Helpers ── */
function padTwo(n) {
  return String(n).padStart(2, "0");
}

/* ── Component ── */
const DetailedDate = ({ dateObj, getMonthTimeTables, onClose }) => {
  const isLogged = localStorage.getItem("accessToken") !== null;

  const [cells, setCells] = useState(
    Array.from({ length: SLOT_COUNT }, () => ({ isSelected: false }))
  );

  const [timetableData, setTimetableData] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [songName, setSongName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TTColors[0][0]);
  const [errorMsg, setErrorMsg] = useState("");
  const [teamTouched, setTeamTouched] = useState(false);
  const [songTouched, setSongTouched] = useState(false);

  // Editing state: null = create mode, object = edit mode
  const [editingTT, setEditingTT] = useState(null);

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

  /* ── Handle selecting an existing timetable block ── */
  const handleSelectTT = (tt) => {
    setEditingTT(tt);
    setTeamName(tt.team || "");
    setSongName(tt.title || "");
    setSelectedColor(`#${tt.color || "486284"}`);
    setErrorMsg("");

    // Highlight the selected timetable's time range
    const sHour = parseInt(tt.start.split("T")[1].split(":")[0]);
    const eHour = parseInt(tt.end.split("T")[1].split(":")[0]);
    setCells((prev) =>
      prev.map((c, i) => ({
        ...c,
        isSelected: i >= sHour - 9 && i < eHour - 9,
      }))
    );
  };

  /* ── Reset to create mode ── */
  const resetToCreateMode = () => {
    setEditingTT(null);
    setTeamName("");
    setSongName("");
    setSelectedColor(TTColors[0][0]);
    setErrorMsg("");
    setTeamTouched(false);
    setSongTouched(false);
    setCells(
      Array.from({ length: SLOT_COUNT }, () => ({ isSelected: false }))
    );
  };

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

    // Check overlap with existing timetables (exclude the one being edited)
    for (const tt of timetableData) {
      if (editingTT && tt.id === editingTT.id) continue;
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

  /* ── Submit (Create) ── */
  const FIELD_ERRORS = new Set(["팀명을 입력해주세요.", "곡 이름을 입력해주세요."]);

  const handleCreate = async () => {
    setTeamTouched(true);
    setSongTouched(true);
    setErrorMsg("");
    const error = validate();
    if (error) {
      if (!FIELD_ERRORS.has(error)) setErrorMsg(error);
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
      resetToCreateMode();
    } catch (err) {
      const msg =
        err.response?.data?.message || "합주 생성 중 오류가 발생했습니다.";
      setErrorMsg(msg);
    }
  };

  /* ── Update ── */
  const handleUpdate = async () => {
    setTeamTouched(true);
    setSongTouched(true);
    setErrorMsg("");
    const error = validate();
    if (error) {
      if (!FIELD_ERRORS.has(error)) setErrorMsg(error);
      return;
    }
    if (!window.confirm("정말 변경하시겠습니까?")) return;

    const range = getSelectedRange();
    const dateStr = `${dateObj.getFullYear()}-${padTwo(dateObj.getMonth() + 1)}-${padTwo(dateObj.getDate())}`;

    const data = {
      id: editingTT.id,
      title: songName.trim(),
      team: teamName.trim(),
      description: editingTT.description || "",
      color: selectedColor.replace("#", ""),
      start: `${dateStr}T${padTwo(range.startHour)}:00`,
      end: `${dateStr}T${padTwo(range.endHour)}:00`,
    };

    try {
      await TimeTableAPI.updateTimeTable(data);
      await fetchTimetables();
      if (typeof getMonthTimeTables === "function") getMonthTimeTables();
      resetToCreateMode();
    } catch (err) {
      const msg =
        err.response?.data?.message || "합주 변경 중 오류가 발생했습니다.";
      setErrorMsg(msg);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    if (!editingTT) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await TimeTableAPI.deleteTimeTable(editingTT.id);
      await fetchTimetables();
      if (typeof getMonthTimeTables === "function") getMonthTimeTables();
      resetToCreateMode();
    } catch (err) {
      const msg =
        err.response?.data?.message || "합주 삭제 중 오류가 발생했습니다.";
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
          setCells={(updater) => {
            // When user drags on the grid, exit edit mode
            setEditingTT(null);
            setTeamName("");
            setSongName("");
            setSelectedColor(TTColors[0][0]);
            setErrorMsg("");
            setCells(updater);
          }}
          timetableData={timetableData}
          onSelectTT={handleSelectTT}
          selectedTTId={editingTT?.id}
        />
      </LeftPanel>

      <RightPanel>
        <RightHeader>
          <HeaderTitle>합주 생성하기</HeaderTitle>
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
              onBlur={() => setTeamTouched(true)}
            />
            <HintText style={{ visibility: teamTouched && !teamName ? "visible" : "hidden" }}>팀명을 입력하세요.</HintText>
          </FieldGroup>

          <FieldGroup>
            <SectionTitle>곡 이름</SectionTitle>
            <TextInput
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
              onBlur={() => setSongTouched(true)}
            />
            <HintText style={{ visibility: songTouched && !songName ? "visible" : "hidden" }}>곡 이름을 입력하세요.</HintText>
          </FieldGroup>

          <FieldGroup style={{ marginTop: "1.2rem" }}>
            <SectionTitle>팀 색상</SectionTitle>
            <CustomColorPicker
              colors={TTColors.map((x) => x[0])}
              color={selectedColor}
              onChange={setSelectedColor}
            />
          </FieldGroup>

          <BottomArea>
            {errorMsg && <ErrorMsg>{errorMsg}</ErrorMsg>}

            {editingTT ? (
              <SubmitBtn onClick={handleUpdate} disabled={!isLogged}>
                합주 변경하기
              </SubmitBtn>
            ) : (
              <SubmitBtn onClick={handleCreate} disabled={!isLogged}>
                합주 생성하기
              </SubmitBtn>
            )}

            {!isLogged && <LoginHint>로그인 후 이용하세요!</LoginHint>}
          </BottomArea>

          {isLogged && editingTT && (
            <DeleteBtnWrapper>
              <DeleteBtn onClick={handleDelete}>합주 삭제하기</DeleteBtn>
            </DeleteBtnWrapper>
          )}
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
