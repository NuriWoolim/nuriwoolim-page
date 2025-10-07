// tests/msw/handlers.js
import { http, HttpResponse } from "msw";
const baseURL = import.meta.env.VITE_API_URL;
let db = [];
export const resetDb = () => {
  db = [];
};
export const handlers = [
  http.post(`${baseURL}/api/timetables`, async ({ request }) => {
    const body = await request.json();
    const created = { id: 1, ...body };
    db.push(created);
    console.log(db);
    return HttpResponse.json(created, { status: 200 });
  }),
  http.patch(`${baseURL}/api/timetables/:id`, async ({ params, request }) => {
    const id = Number(params.id);
    const body = await request.json();
    const idx = db.findIndex((x) => x.id === id);
    if (idx === -1) {
      return HttpResponse.json({ message: "not found" }, { status: 404 });
    }
    db[idx] = { ...db[idx], ...body }; // 병합 업데이트
    return HttpResponse.json(db[idx], { status: 200 });
  }),
  http.get(`${baseURL}/api/timetables`, ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    console.log(db);
    return HttpResponse.json({
      from: from ?? "2025-10-02T09:00:00.856Z",
      to: to ?? "2025-10-02T22:00:00.856Z",
      data: db,
    });
  }),
];
