import { render, screen, within } from "@testing-library/react";
import Calendar from "../pages/Calendar";

import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { waitFor, waitForElementToBeRemoved } from "@testing-library/react";

describe("타임테이블 CRUD", () => {
  beforeEach(() => {
    localStorage.setItem("accessToken", "calendar-test-token");
    vi.stubGlobal("confirm", () => true);
  });

  it("추가, 수정, 삭제", async () => {
    render(<Calendar />);

    const user = userEvent.setup();
    const div = screen.getAllByText("2")[0];

    await user.click(div);

    // const test2 = screen.getByText(/\/2/);

    const DDWindow = await screen.findByTestId("DetailedDate");
    const queryScheduleEntry = (title) =>
      within(DDWindow).queryByText(new RegExp(title), { selector: "span" });
    const getScheduleEntry = (title) =>
      within(DDWindow).getByText(new RegExp(title), { selector: "span" });

    const cell1 = within(DDWindow).getByText("13");
    await user.click(cell1);

    const [teamInput, titleInput] = within(DDWindow).getAllByRole("textbox");

    await user.type(teamInput, "델몬트");
    await user.type(titleInput, "오렌지의 시간");

    const addButton = within(DDWindow).getByRole("button", {
      name: /합주 생성하기/,
    });
    await user.click(addButton);

    await waitFor(() => {
      expect(queryScheduleEntry("오렌지의 시간")).toBeInTheDocument();
    });

    const orangeButton = getScheduleEntry("오렌지의 시간");
    await user.click(orangeButton);

    const [, titleInput2] = within(DDWindow).getAllByRole("textbox");
    await user.clear(titleInput2);
    await user.type(titleInput2, "사과의 시간");

    const updateButton2 = within(DDWindow).getByRole("button", {
      name: /합주 변경하기/,
    });
    await user.click(updateButton2);

    await waitFor(() => {
      expect(queryScheduleEntry("사과의 시간")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(queryScheduleEntry("오렌지의 시간")).not.toBeInTheDocument();
    });

    const appleButton = getScheduleEntry("사과의 시간");
    await user.click(appleButton);

    const deleteButton = within(DDWindow).getByRole("button", {
      name: /합주 삭제하기/,
    });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(queryScheduleEntry("사과의 시간")).not.toBeInTheDocument();
    });
  });
});
