import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { createStore } from "jotai/vanilla";
export const userDataState = atomWithStorage("userDataState", {
  id: null,
  name: null,
  email: null,
  type: null,
  year: null,
  createdDate: null,
});
export const store = createStore();
