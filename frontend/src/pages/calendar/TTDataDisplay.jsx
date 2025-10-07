import { React, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { CirclePicker } from "react-color";
import { READ, UPDATE, CREATE, TIMELIMIT } from "./DetailedDate";
import { TTColors } from "../../data/CalendarData";

import { TimeTableAPI } from "../../apis/common";

const TTDDContainer = styled.div`
  min-width: 34rem;
  border: solid 1px black;
  background: #fff7e2;
`;

const TextInput = styled.input`
  border: none;
  box-shadow: 1px 1px 4.1px 0 rgba(72, 98, 132, 0.2) inset;
  width: 23rem;
  height: 3rem;

  margin: 0.5rem 1rem;
`;

const Form = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;

  justify-content: space-evenly;
  align-items: center;
`;

const FormElement = styled.div`
  display: flex;
  flex-direction: column;
  label {
    color: #486284;

    font-family: Pretendard;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
`;

const StyledCirclePicker = styled(CirclePicker)`
  margin: 0.5rem 1rem;
  width: 23rem;
`;
function toLocalISOString(date) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0부터 시작하니까 +1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const isSelectedError = (cells, exceptionTT) => {
  let selectedCnt = 0,
    first = 0,
    err = false;
  //   console.log("a");
  cells.map((cell, i) => {
    // 선택한 자리에 타임테이블 존재하면 에러
    if (
      cell.tt !== null &&
      cell.isSelected === true &&
      cell.tt?.id !== exceptionTT?.id
    ) {
      err = true;
    }
    if (cell.isSelected === true) selectedCnt += 1;

    if (
      cell.isSelected === true &&
      (i == 0 || cells[i - 1].isSelected === false)
    )
      first += 1;
  });
  // 최대 시간 제한
  if (selectedCnt > TIMELIMIT) err = true;
  // 연속적이어야함, 최소 하나 선택해야함
  if (first != 1) err = true;

  return err;
};

const ReadMode = ({ selectedTT, setSelectedTT, setDataMode, callTTGetApi }) => {
  const deleteTT = async (id) => {
    try {
      const result = await TimeTableAPI.deleteTimeTable(id);
      callTTGetApi();
      setDataMode(READ);
      setSelectedTT(null);
    } catch (error) {
      if (error.response)
        console.error("응답 에러:", error.response.status, error.response.data);
    }
  };
  return (
    <>
      {selectedTT === null ? (
        <div>일정을 선택하세요</div>
      ) : (
        <div>
          <div>{selectedTT.title}</div>
          <div>{selectedTT.team}</div>
          <div>{selectedTT.description}</div>
          <div>{selectedTT.start}</div>
          <div>{selectedTT.end}</div>
          <button onClick={() => setDataMode(UPDATE)}>일정 수정</button>
          <button onClick={() => deleteTT(selectedTT.id)}>일정 삭제</button>
        </div>
      )}
    </>
  );
};
const UpdateMode = ({
  setDataMode,
  cells,
  times,
  selectedTT,
  setSelectedTT,
  callTTGetApi,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: selectedTT.title,
      team: selectedTT.team,
      description: selectedTT.description,
      color: selectedTT.color,
    },
  });

  const onSubmit = async (data) => {
    let l = -1,
      r = -1;
    for (let i = 0; i < times.length; i++) {
      if (cells[i].isSelected === true) {
        if (i === 0 || cells[i - 1].isSelected === false) {
          l = i;
        }
        r = i;
      }
    }

    const finaldata = {
      ...data,
      start: toLocalISOString(times[l]),
      end: toLocalISOString(times[r + 1]),
      color: data.color.slice(-6),
      id: selectedTT.id,
    };

    try {
      const result = await TimeTableAPI.updateTimeTable(finaldata);
      callTTGetApi();
      setSelectedTT(null);
      setDataMode(READ);
    } catch (error) {
      if (error.response)
        console.error("응답 에러:", error.response.status, error.response.data);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormElement>
          <label htmlFor="title">곡 이름</label>
          <TextInput
            id="title"
            {...register("title", { required: "제목을 입력하세요" })}
            // placeholder="제목"
          />
        </FormElement>

        <FormElement>
          <label htmlFor="team">팀 이름</label>
          <TextInput
            id="team"
            {...register("team", { required: "제목을 입력하세요" })}
            // placeholder="팀"
          />
        </FormElement>

        <FormElement>
          <label htmlFor="description">설명</label>
          <TextInput id="description" {...register("description")} />
        </FormElement>
        <FormElement>
          <label>색 설정</label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <StyledCirclePicker
                colors={TTColors.map((x) => x[0])}
                color={field.value}
                onChangeComplete={(c) => field.onChange(c.hex)}
                circleSize={30}
              />
            )}
          />
        </FormElement>
        <div>
          {!isSelectedError(cells, selectedTT) && (
            <button type="submit">수정</button>
          )}
          <button type="button" onClick={() => setDataMode(READ)}>
            취소
          </button>
        </div>
      </Form>
    </>
  );
};
const CreateMode = ({ setDataMode, cells, callTTGetApi, times }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      color: TTColors[0][0], // 첫 번째 색을 기본값으로
    },
  });

  const onSubmit = async (data) => {
    let l = -1,
      r = -1;
    for (let i = 0; i < times.length; i++) {
      if (cells[i].isSelected === true) {
        if (i === 0 || cells[i - 1].isSelected === false) {
          l = i;
        }
        r = i;
      }
    }
    const finaldata = {
      ...data,
      start: toLocalISOString(times[l]),
      end: toLocalISOString(times[r + 1]),
      color: data.color.slice(-6),
    };

    // console.log(finaldata);

    try {
      const result = await TimeTableAPI.createTimeTable(finaldata);

      callTTGetApi();
      setDataMode(READ);
      //   setCells((prevCells) =>
      //     prevCells.map((cell, idx) =>
      //       idx >= l && idx <= r ? { ...cell, tt: result.data } : cell
      //     )
      //   );
    } catch (error) {
      if (error.response)
        console.error("응답 에러:", error.response.status, error.response.data);
    }
  };

  const onError = (errors) => {
    console.log("Cannot submit - validation errors:", errors);
  };
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormElement>
          <label htmlFor="title">곡 이름</label>
          <TextInput
            id="title"
            {...register("title", { required: "제목을 입력하세요" })}
            // placeholder="제목"
          />
        </FormElement>

        <FormElement>
          <label htmlFor="team">팀 이름</label>
          <TextInput
            id="team"
            {...register("team", { required: "제목을 입력하세요" })}
            // placeholder="팀"
          />
        </FormElement>

        <FormElement>
          <label htmlFor="description">설명</label>
          <TextInput id="description" {...register("description")} />
        </FormElement>
        <FormElement>
          <label>색 설정</label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <StyledCirclePicker
                colors={TTColors.map((x) => x[0])}
                color={field.value}
                onChangeComplete={(c) => field.onChange(c.hex)}
                circleSize={30}
              />
            )}
          />
        </FormElement>
        <div>
          {!isSelectedError(cells, null) && <button type="submit">추가</button>}
          <button type="button" onClick={() => setDataMode(READ)}>
            취소
          </button>
        </div>
      </Form>
    </>
  );
};

const TTDataDisplay = ({
  selectedTT,
  setSelectedTT,
  dataMode,
  setDataMode,
  cells,
  callApi,
  times,
}) => {
  return (
    <TTDDContainer>
      {dataMode === CREATE ? (
        <CreateMode
          setDataMode={setDataMode}
          cells={cells}
          callTTGetApi={callApi}
          times={times}
        />
      ) : dataMode === READ ? (
        <ReadMode
          setSelectedTT={setSelectedTT}
          selectedTT={selectedTT}
          setDataMode={setDataMode}
          callTTGetApi={callApi}
        />
      ) : (
        <UpdateMode
          setDataMode={setDataMode}
          cells={cells}
          times={times}
          selectedTT={selectedTT}
          setSelectedTT={setSelectedTT}
          callTTGetApi={callApi}
        />
      )}

      {dataMode != CREATE && (
        <button
          onClick={() => {
            setDataMode(CREATE);
          }}
        >
          일정 추가
        </button>
      )}
    </TTDDContainer>
  );
};
export default TTDataDisplay;
