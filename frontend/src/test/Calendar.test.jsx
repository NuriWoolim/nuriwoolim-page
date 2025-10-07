import { render, screen, within, fireEvent } from "@testing-library/react";
import Calendar from "../pages/Calendar";

import { describe, expect, it, vi, not } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";

import { login } from "../apis/user";

describe("타임테이블 CRUD", () => {
  it("추가, 수정, 삭제", async () => {
    render(<Calendar />);

    const user = userEvent.setup();
    const div = screen.getAllByText("2")[0];

    await user.click(div);

    // const test2 = screen.getByText(/\/2/);

    const DDWindow = await screen.findByTestId("DetailedDate");

    const addButton = within(DDWindow).getByRole("button", { name: /추가/ });

    // const cell2 = within(DDWindow).getByText(/15/);

    await user.click(addButton);

    const cell1 = within(DDWindow).getByText("13");
    await user.click(cell1);
    // fireEvent.mouseDown(cell1, { clientX: 0, clientY: 0 }); // 클릭 시작
    // fireEvent.mouseMove(document, { clientX: 0, clientY: 200 }); // 마우스 이동
    // fireEvent.mouseUp(document); // 클릭 해제

    const titleInput = within(DDWindow).getByLabelText(/곡 이름/i);
    const teamInput = within(DDWindow).getByLabelText(/팀 이름/i);
    const descriptionInput = within(DDWindow).getByLabelText(/설명/i);

    await user.type(titleInput, "오렌지의 시간");
    await user.type(teamInput, "델몬트");
    await user.type(descriptionInput, "맛있다!");

    const addButton2 = within(DDWindow).getByText(/추가/);

    await user.click(addButton2);

    // expect(global.fetch).toHaveBeenCalledWith(
    //   "/api/timetables",
    //   expect.objectContaining({ method: "POST" })
    // );

    await waitFor(() => {
      expect(within(DDWindow).getByText(/오렌지의 시간/)).toBeInTheDocument();
    });

    //// 수정

    const OrangeButton = within(DDWindow).getByText(/오렌지의 시간/);

    await user.click(OrangeButton);

    const updateButton = within(DDWindow).getByText(/수정/);

    await user.click(updateButton);

    const titleInput2 = within(DDWindow).getByLabelText(/곡 이름/);

    await user.clear(titleInput2);
    await user.type(titleInput2, "사과의 시간");

    const updateButton2 = within(DDWindow).getByText(/수정/);

    // vi.useFakeTimers();
    await user.click(updateButton2);

    // vi.runOnlyPendingTimers();
    // vi.useRealTimers();

    await waitForElementToBeRemoved(() =>
      within(DDWindow).getByText(/오렌지의 시간/)
    );

    await within(DDWindow).findByText(/사과의 시간/);
  });


  ////
});
