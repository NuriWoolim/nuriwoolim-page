import React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { TimeLineAPI } from "../../apis/common";

const CREATE = 0;
const READ = 1;
const UPDATE = 2;
const DELETE = 3;

const TimeLineContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  width: 12.2rem;
  /* border: red solid 2px; */
  padding-left: 6.5rem;
  padding-bottom: 1.1rem;
`;
const TimeLineWrapper = styled.div`
  height: 51rem;
  width: 11.9rem;
  /* border: black solid 2px; */

  /* padding-top: 2.31rem; */
  overflow-y: auto;
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #bdbcbc #f0f0f0;
`;

const Line = styled.div`
  position: relative;
  top: 2.31rem;
  min-height: 48.68rem;
  height: ${(props) => props.$height}rem;
  border-right: 0.25rem solid #486284;
  width: 9.21rem;

  display: flex;
  flex-direction: column;
  gap: 4.56rem;
`;

const ClubEventContainer = styled.div`
  /* border: green solid 2px; */
  padding-right: 0.5rem;
  margin-right: 2.5rem;
  place-items: end;
  position: relative;
  bottom: 2rem;
  /* padding-bottom: -1rem; */
  transition: background-color 0.1s ease;
  h2 {
    color: #486284;
  }
  h4 {
    margin-bottom: 0.4rem;
  }
  &:hover {
    background-color: #bdbcbc;
    cursor: pointer;
  }
`;
const Circle = styled.div`
  width: 0.93rem;
  height: 0.93rem;
  border-radius: 1rem;
  background-color: #486284;

  position: absolute;
  left: 8.85rem;
  bottom: 1.5rem;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10;
`;

const DropdownContainer = styled.div`
  position: fixed;
  z-index: 20;
  background: white;
  box-shadow: 4px 4px 18px rgba(0, 0, 0, 0.6);
  min-width: 300px;
  overflow: auto;

  left: 10rem;
  top: 50%;
  transform: translateY(-50%);
  width: 50vw;
  height: 60vh;
`;
const EditWindow = styled.div`
  background-color: #fff;
  width: 60rem;
  height: 50rem;
  border: solid 2px green;

  table {
    border-collapse: collapse;
  }
  th,
  td {
    border: 2px solid #ccc;
    text-align: left;
    width: 9rem;
  }

  tr {
    background-color: ${(props) => props.$color};
  }
`;

const Row = styled.tr`
  background-color: ${(p) => p.$color};
  border: ${(p) => p.$border};

  input {
    width: 98%;
    border: none;
  }
`;

const CRUDButton = styled.button`
  opacity: ${(p) => p.$opacity};
`;
const FormRow = ({ register, handleSubmit, setMode, type, ...rest }) => {
  return (
    <Row {...rest}>
      <td>
        <input
          {...register("title", {
            required: "제목을 입력하세요",
          })}
        />
      </td>
      <td>
        <input {...register("description")} />
      </td>
      <td>
        <input
          type="date"
          {...register("start", {
            required: "시작일을 입력하세요",
          })}
        />
      </td>
      <td>
        <input
          type="date"
          {...register("end", {
            required: "종료일을 입력하세요",
          })}
        />
      </td>
      <td>
        <button>저장</button>
      </td>
      <td>
        <button onClick={() => setMode(READ)}>취소</button>
      </td>
    </Row>
  );
};

const TimeLine = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const [clubEvents, setClubEvents] = useState([]);
  const [isEditWindowOpen, setIsEditWindowOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [mode, setMode] = useState(READ);
  const reloadClubEvents = async () => {
    try {
      const result = await TimeLineAPI.getTimeLine(
        "2023-01-01T00:00",
        "2050-01-01T00:00"
      );
      return result.data;
    } catch (error) {
      console.error(
        "API call error",
        error.response.status,
        error.response.data
      );
      return Array.from({ length: 5 }, () => ({
        id: 0,
        title: "개강일",
        description: "설명",
        color: "string",
        start: "2025-10-19T17:37:01.057Z",
        end: "2025-10-19T17:37:01.057Z",
      }));
    }
  };
  useEffect(() => {
    const load = async () => {
      const result = await reloadClubEvents();
      setClubEvents(result.data);
    };
    load();
  }, []);

  const onSubmit = async (data) => {
    if (mode == CREATE) {
      try {
        await TimeLineAPI.createTimeLine({
          ...data,
          start: data.start + "T00:00",
          end: data.end + "T23:59",
          color: "000000",
        });
      } catch (error) {
        console.error(
          "API call error",
          error.response.status,
          error.response.data
        );
      }
    } else if (mode == UPDATE) {
      try {
        await TimeLineAPI.updateTimeLine({
          ...clubEvents[selectedRow],
          ...data,
          start: data.start + "T00:00",
          end: data.end + "T23:59",
        });
      } catch (error) {
        console.error(
          "API call error",
          error.response.status,
          error.response.data
        );
      }
    } else if (mode == DELETE) {
      try {
        await TimeLineAPI.deleteTimeLine(clubEvents[selectedRow].id);
      } catch (error) {
        console.error(
          "API call error",
          error.response.status,
          error.response.data
        );
      }
    }

    const t = await reloadClubEvents();
    setClubEvents(t.data);
    setMode(READ);
  };
  return (
    <TimeLineContainer>
      <TimeLineWrapper>
        <button onClick={() => setIsEditWindowOpen(true)}>일정 추가</button>
        <Line $height={clubEvents.length * 9.56}>
          {clubEvents.map((clubEvent, i) => (
            <ClubEventContainer key={i}>
              <h2>
                {clubEvent.start.split("T")[0].split("-")[1]}.
                {clubEvent.start.split("T")[0].split("-")[2]}
              </h2>
              <h4>{clubEvent.title}</h4>
              <Circle></Circle>
            </ClubEventContainer>
          ))}
        </Line>
      </TimeLineWrapper>

      {isEditWindowOpen && (
        <Overlay onClick={() => setIsEditWindowOpen(false)} />
      )}
      {isEditWindowOpen && (
        <DropdownContainer>
          <EditWindow>
            <form onSubmit={handleSubmit(onSubmit)}>
              <table>
                <thead>
                  <tr>
                    <th>일정명</th>
                    <th>게시글 링크</th>
                    <th>시작일</th>
                    <th>종료일</th>
                  </tr>
                </thead>
                <tbody>
                  {clubEvents.map((clubEvent, i) => (
                    <React.Fragment key={i}>
                      {mode !== UPDATE || selectedRow !== i ? (
                        <Row
                          key={i}
                          $color={i % 2 ? "#fff" : "#ccc"}
                          $border={
                            selectedRow == i ? "3px dashed #000" : "none"
                          }
                          onClick={
                            mode == READ ? () => setSelectedRow(i) : null
                          }
                        >
                          <td>{clubEvent.title}</td>
                          <td>{clubEvent.description}</td>
                          <td>{clubEvent.start.split("T")[0]}</td>
                          <td>{clubEvent.end.split("T")[0]}</td>
                          {mode == DELETE && selectedRow == i && (
                            <td>
                              <button>확인</button>
                            </td>
                          )}

                          {mode == DELETE && selectedRow == i && (
                            <td>
                              <button onClick={() => setMode(READ)}>
                                취소
                              </button>
                            </td>
                          )}
                        </Row>
                      ) : (
                        <FormRow
                          key={i}
                          $color={i % 2 ? "#fff" : "#ccc"}
                          $border={
                            selectedRow == i ? "3px dashed #000" : "none"
                          }
                          register={register}
                          handleSubmit={handleSubmit}
                          setMode={setMode}
                          type={UPDATE}
                        />
                      )}
                    </React.Fragment>
                  ))}
                  {mode == CREATE && (
                    <FormRow
                      register={register}
                      handleSubmit={handleSubmit}
                      setMode={setMode}
                      type={CREATE}
                    />
                  )}
                </tbody>
              </table>
            </form>
            <CRUDButton
              onClick={() => {
                setMode(CREATE);
                setSelectedRow(null);
              }}
              $opacity={mode == CREATE ? "0.6" : "1"}
            >
              추가
            </CRUDButton>
            {selectedRow !== null && (
              <CRUDButton
                onClick={() => setMode(UPDATE)}
                $opacity={mode == UPDATE ? "0.6" : "1"}
              >
                수정
              </CRUDButton>
            )}
            {selectedRow !== null && (
              <CRUDButton
                onClick={() => setMode(DELETE)}
                $opacity={mode == DELETE ? "0.6" : "1"}
              >
                삭제
              </CRUDButton>
            )}
          </EditWindow>
        </DropdownContainer>
      )}
    </TimeLineContainer>
  );
};

export default TimeLine;
