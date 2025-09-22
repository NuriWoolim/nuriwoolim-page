export function createDate(str) {
  // "YYYY-MM-DDTHH:mm" 형식 가정
  const [datePart, timePart] = str.split("T");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // JS Date에서 month는 0부터 시작 (12월 = 11)
  return new Date(year, month - 1, day, hour, minute);
}

export function toLocalISOString(date) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0부터 시작하니까 +1
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
