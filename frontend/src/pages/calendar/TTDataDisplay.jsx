import { React, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";
import { READ, UPDATE, CREATE, TIMELIMIT } from "./detailedDate";

const TTDDContainer = styled.div`
  width: 100%;
  height: 400px;
  border: solid 1px black;
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

const ReadMode = ({ selectedTT, setDataMode }) => {
  const deleteTT = () => {};
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
          <button onClick={deleteTT}>일정 삭제</button>
        </div>
      )}
    </>
  );
};
const UpdateMode = ({ setDataMode, cells, times, selectedTT }) => {
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
    },
  });

  const onSubmit = (data) => {
    let l = -1,
      r = -1,
      error = 0;
    for (let i = 0; i < times.length; i++) {
      if (cells[i] === 1) {
        if (i === 0 || cells[i - 1] !== 1) {
          if (l !== -1) error = 1;
          l = i;
        }

        r = i;
      }
    }
    console.log(l, r, error);
    if (r + 1 - l > 4) error = 1;

    if (error) throw new Error("연속된 최대 2시간의 시간을 선택하세요!");

    const finaldata = {
      ...data,
      start: toLocalISOString(times[l]),
      end: toLocalISOString(times[r + 1]),
    };

    console.log(finaldata);

    setDataMode(READ);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register("title", { required: "제목을 입력하세요" })}
            placeholder="제목"
          />
        </div>
        <div>
          <input
            {...register("team", { required: "제목을 입력하세요" })}
            placeholder="팀"
          />
        </div>
        <div>
          <input {...register("description")} placeholder="설명" />
        </div>
        <div>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <HexColorPicker color={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div>
          <button type="submit">수정</button>
          <button type="button" onClick={() => setDataMode(READ)}>
            취소
          </button>
        </div>
      </form>
    </>
  );
};
const CreateMode = ({ setDataMode, cells, times }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    let l = -1,
      r = -1,
      error = 0;
    for (let i = 0; i < times.length; i++) {
      if (cells[i] === 1) {
        if (i === 0 || cells[i - 1] !== 1) {
          if (l !== -1) error = 1;
          l = i;
        }

        r = i;
      }
    }
    console.log(l, r, error);
    if (r + 1 - l > 4) error = 1;

    if (error) throw new Error("연속된 최대 2시간의 시간을 선택하세요!");

    const finaldata = {
      ...data,
      start: toLocalISOString(times[l]),
      end: toLocalISOString(times[r + 1]),
    };

    console.log(finaldata);

    setDataMode(READ);
  };

  const onError = (errors) => {
    console.log("Cannot submit - validation errors:", errors);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <div>
          <input
            {...register("title", { required: "제목을 입력하세요" })}
            placeholder="제목"
          />
        </div>
        <div>
          <input
            {...register("team", { required: "팀명을 입력하세요" })}
            placeholder="팀"
          />
        </div>
        <div>
          <input {...register("description")} placeholder="설명" />
        </div>
        <div>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <HexColorPicker color={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <div>
          <button type="submit">추가</button>
          <button type="button" onClick={() => setDataMode(READ)}>
            취소
          </button>
        </div>
      </form>
    </>
  );
};

const TTDataDisplay = ({ selectedTT, dataMode, setDataMode, cells, times }) => {
  const isSelectedError = () => {
    let selectedCnt = 0,
      first = 0,
      err = 0;
    cells.map((cell, i) => {
      // 선택한 자리에 타임테이블 존재하면 에러
      if (cell.tt !== null && cell.isSelected === true) err = 1;

      if (cell.isSelected === true) selectedCnt += 1;

      if (
        cell.isSelected === true &&
        (i == 0 || cells[i - 1].isSelected === false)
      )
        first += 1;
    });
    // 최대 시간 제한
    if (selectedCnt > TIMELIMIT) err = 1;
    // 연속적이어야함, 최소 하나 선택해야함
    if (first != 1) err = 1;

    return err;
  };
  return (
    <TTDDContainer>
      {dataMode === CREATE ? (
        <CreateMode setDataMode={setDataMode} cells={cells} times={times} />
      ) : dataMode === READ ? (
        <ReadMode selectedTT={selectedTT} setDataMode={setDataMode} />
      ) : (
        <UpdateMode
          setDataMode={setDataMode}
          cells={cells}
          times={times}
          selectedTT={selectedTT}
        />
      )}
      {selectedTT === null && isSelectedError() === 0 && (
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
