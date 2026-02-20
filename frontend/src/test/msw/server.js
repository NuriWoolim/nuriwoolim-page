import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// 서버 인스턴스 export
export const server = setupServer(...handlers);
