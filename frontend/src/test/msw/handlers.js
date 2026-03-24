// tests/msw/handlers.js
import { http, HttpResponse } from "msw";
let db = [];
export const resetDb = () => {
  db = [];
};
export const handlers = [
  http.post("*/api/timetables", async ({ request }) => {
    const body = await request.json();
    const created = { id: 1, ...body };
    db.push(created);
    return HttpResponse.json(created, { status: 200 });
  }),
  http.patch("*/api/timetables/:id", async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json();
    const idx = db.findIndex((x) => x.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: "not found" }, { status: 404 });
    }
    db[idx] = { ...db[idx], ...body }; // 병합 업데이트
    return HttpResponse.json(db[idx], { status: 200 });
  }),
  http.delete("*/api/timetables/:id", async () => {
    resetDb();
    return new HttpResponse(null, { status: 200 });
  }),
  http.get("*/api/timetables", ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    return HttpResponse.json({
      from: from ?? "2025-10-02T09:00:00.856Z",
      to: to ?? "2025-10-02T22:00:00.856Z",
      data: db,
    });
  }),
  http.get("*/api/schedules", ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json({
      from: url.searchParams.get("from") ?? "2025-10-01",
      to: url.searchParams.get("to") ?? "2025-10-31",
      data: [],
    });
  }),
];
