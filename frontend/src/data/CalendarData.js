export const TTColorBgMap = {};
export const TTColors = [
  ["#3D5286", "#E8EEF1"],
  ["#60863D", "#EBFFD8"],
  ["#EDBB13", "#FFF7DE"],
  ["#A10B56", "#FFE2F1"],
  ["#5F3D86", "#E8D4FF"],

  ["#86573D", "#FFE2D2"],
  ["#3D7486", "#CFF3FF"],
  ["#3D867F", "#C7FFFA"],
  ["#3D4443", "#E3E3E3"],
  ["#FF3838", "#FFE3E3"],
];
TTColors.forEach(([c, bg]) => { TTColorBgMap[c] = bg; });

// hex 색상을 흰색과 혼합한 solid 라이트 색상 반환
const hexToLightSolid = (hex, intensity = 0.15) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (c) => Math.round(c * intensity + 255 * (1 - intensity));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

// color: 백엔드에서 받은 hex 문자열 (# 포함 or 미포함). 없으면 랜덤 세트 반환
// returns [textColor, bgColor]
export const getColorPair = (color) => {
  if (color) {
    const hex = color.startsWith("#") ? color : `#${color}`;
    const bg = TTColorBgMap[hex] || hexToLightSolid(hex);
    return [hex, bg];
  }
  return TTColors[Math.floor(Math.random() * TTColors.length)];
};
