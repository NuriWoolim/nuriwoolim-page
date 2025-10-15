import { React, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { CirclePicker } from "react-color";
import { READ, UPDATE, CREATE, TIMELIMIT } from "./DetailedDate";
import { TTColors } from "../../data/CalendarData";

import CustomColorPicker from "./CustomColorPicker";
import { TimeTableAPI } from "../../apis/common";

const TTDDContainer = styled.div`
  flex: 1;
  /* border: solid 1px black; */
  background: #fff7e2;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
`;

const TextInput = styled.input`
  border: none;
  box-shadow: 1px 1px 4.1px 0 rgba(72, 98, 132, 0.2) inset;
  width: 14.42038rem;
  height: 2.40338rem;

  margin: 0.4rem 0.5rem;
  padding: 0.6rem;
`;

const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;

  align-items: center;
`;

const FormMain = styled.div`
  flex: 1;
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* padding-top: 1.5rem; */
  padding-bottom: 2rem;

  align-items: center;
  h3 {
    color: #486284;
    margin: 0 0 0 0;
  }

  p {
    color: #486284;
  }
`;

const ShowElement = styled.div`
  width: 100%;
  height: 6rem;
  h2 {
    color: #486284;
    text-align: left;
    margin-left: 0.2rem;
    padding-left: 0.4rem;
  }
  h3 {
    margin-bottom: 0.4rem;
  }
  p {
    margin-left: 0.2rem;
    padding-left: 0.4rem;
    border-left: #486284 solid 2px;
  }
`;

const ShowTime = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  h2 {
    color: #486284;
    text-align: left;
    margin-left: 0.2rem;
    padding-left: 0.4rem;
  }
  h3 {
    position: relative;
    margin: 0 0 0 0;
    top: -0.2rem;
  }
`;

const FormElement = styled.div`
  display: flex;
  flex-direction: column;
  label {
    color: #486284;

    font-family: Pretendard;
    font-size: 1.2rem;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
`;

const StyledCirclePicker = styled(CirclePicker)`
  margin: 0.5rem 1rem;
  /* width: 23rem; */
`;

const Button = styled.button`
  flex: 1;
  background: ${(props) => props.$color};
  border: none;
  box-shadow: 1.403px 1.403px 4.193px 0 rgba(0, 0, 0, 0.15) inset;

  color: #fff;
  h3 {
    margin: 0 0 0 0;
  }
  & {
    transition: transform 0.1s ease;
  }
  &:hover {
    /* transform: scale(1.05); */
    opacity: 90%;
  }
  &:active {
    opacity: 80%;
  }
`;

const ButtonsContainer = styled.div`
  gap: 1rem;
  width: 14.4rem;
  height: 2.7rem;
  display: flex;
  margin-top: auto;
  margin-bottom: 1rem;
`;

const HowToUse = styled.div`
  width: 14.2rem;
  h3 {
    text-align: center;
    margin: 0 0 0.5rem 0;
  }
  p {
    text-align: center;
  }
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
        <p>일정을 선택하세요</p>
      ) : (
        <Form>
          <FormMain>
            <ShowElement>
              <ShowTime>
                <h3>시작:</h3>
                <h2>
                  {selectedTT.start.split("T")[1].split(":")[0]}:
                  {selectedTT.start.split("T")[1].split(":")[1]}
                </h2>
              </ShowTime>

              <ShowTime>
                <h3>종료:</h3>
                <h2>
                  {selectedTT.end.split("T")[1].split(":")[0]}:
                  {selectedTT.end.split("T")[1].split(":")[1]}
                </h2>
              </ShowTime>
            </ShowElement>

            <ShowElement>
              <h3>곡명</h3>
              <p>{selectedTT.title}</p>
            </ShowElement>

            <ShowElement>
              <h3>제목</h3>
              <p>{selectedTT.team}</p>
            </ShowElement>

            <ShowElement>
              <h3>설명</h3>
              <p>{selectedTT.description}</p>
            </ShowElement>
          </FormMain>

          <ButtonsContainer>
            <Button onClick={() => setDataMode(UPDATE)} $color="#486284">
              <h3>일정 수정</h3>
            </Button>
            <Button onClick={() => deleteTT(selectedTT.id)} $color="#FFA8A8">
              <h3>일정 삭제</h3>
            </Button>
          </ButtonsContainer>
        </Form>
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
        <FormMain>
          <HowToUse>
            <h3>이용 안내</h3>
            <p>
              좌측 시트에서 원하는 시간 드래그 후, 우측 정보란에 해당하는 정보
              입력한 뒤 수정 버튼을 눌러주시면 됩니다.
            </p>
          </HowToUse>
          <FormElement>
            <label htmlFor="title">
              <h4>곡 이름</h4>
            </label>
            <TextInput
              id="title"
              {...register("title", { required: "제목을 입력하세요" })}
              // placeholder="제목"
            />
          </FormElement>

          <FormElement>
            <label htmlFor="team">
              <h4>팀 이름</h4>
            </label>
            <TextInput
              id="team"
              {...register("team", { required: "제목을 입력하세요" })}
              // placeholder="팀"
            />
          </FormElement>

          <FormElement>
            <label htmlFor="description">
              <h4>설명</h4>
            </label>
            <TextInput id="description" {...register("description")} />
          </FormElement>
          <FormElement>
            <label>
              <h4>색 설정</h4>
            </label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <CustomColorPicker
                  colors={TTColors.map((x) => x[0])}
                  color={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormElement>
        </FormMain>
        <ButtonsContainer>
          {!isSelectedError(cells, selectedTT) && (
            <Button $color={"#486284"} type="submit">
              <h3>수정</h3>
            </Button>
          )}
          <Button
            type="button"
            onClick={() => setDataMode(READ)}
            $color={"#FFA8A8"}
          >
            <h3>취소</h3>
          </Button>
        </ButtonsContainer>
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
        <FormMain>
          <HowToUse>
            <h3>이용 안내</h3>
            <p>
              좌측 시트에서 원하는 시간 드래그 후, 우측 정보란에 해당하는 정보
              입력한 뒤 추가 버튼을 눌러주시면 됩니다.
            </p>
          </HowToUse>
          <FormElement>
            <label htmlFor="title">
              <h4>곡 이름</h4>
            </label>
            <TextInput
              id="title"
              {...register("title", { required: "제목을 입력하세요" })}
              // placeholder="제목"
            />
          </FormElement>

          <FormElement>
            <label htmlFor="team">
              <h4>팀 이름</h4>
            </label>
            <TextInput
              id="team"
              {...register("team", { required: "제목을 입력하세요" })}
              // placeholder="팀"
            />
          </FormElement>

          <FormElement>
            <label htmlFor="description">
              <h4>설명</h4>
            </label>
            <TextInput id="description" {...register("description")} />
          </FormElement>

          <FormElement>
            <label>
              <h4>색 설정</h4>
            </label>
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <CustomColorPicker
                  colors={TTColors.map((x) => x[0])}
                  color={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormElement>
        </FormMain>
        <ButtonsContainer>
          {!isSelectedError(cells, null) && (
            <Button $color={"#486284"} type="submit">
              <h3>추가</h3>
            </Button>
          )}
          <Button
            type="button"
            onClick={() => setDataMode(READ)}
            $color={"#FFA8A8"}
          >
            <h3>취소</h3>
          </Button>
        </ButtonsContainer>
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

      {dataMode == READ && (
        <ButtonsContainer>
          <Button
            onClick={() => {
              setSelectedTT(null);
              setDataMode(CREATE);
            }}
            $color="#486284"
          >
            <h3>일정 추가</h3>
          </Button>
        </ButtonsContainer>
      )}
    </TTDDContainer>
  );
};
export default TTDataDisplay;
