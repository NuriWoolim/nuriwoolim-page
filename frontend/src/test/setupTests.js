import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./msw/server";
import { resetDb } from "./msw/handlers";
// 테스트 시작 전에 mock 서버 켜기
beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
//   resetDb();
  //   vi.resetModules();
});

// 각 테스트 끝날 때마다 핸들러 상태 초기화
afterEach(() => {
  server.resetHandlers();
  resetDb();          
//   vi.restoreAllMocks();    
});

// 모든 테스트 끝나면 서버 닫기
afterAll(() => server.close());
