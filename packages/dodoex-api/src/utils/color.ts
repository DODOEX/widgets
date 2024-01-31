export interface RgbColor {
  r: number;
  g: number;
  b: number;
}
export interface RgbaColor extends RgbColor {
  a: number;
}
export function rgbaColorToColor(rgbaColor?: RgbaColor) {
  if (!rgbaColor) return rgbaColor;
  return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${rgbaColor.a})`;
}
function hexToRgbaColor(hex: string) {
  var result =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})\s*([0-9]{1,3})*%?$/i.exec(hex);
  return result
    ? ({
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: result[4] ? Number(result[4]) / 100 : 1,
      } as RgbaColor)
    : undefined;
}
export function strToColorStr(str?: string) {
  if (!str) return str;
  if (/^#[a-f\d]{3,6}\s*[0-9]{1,3}%/i.test(str)) {
    return rgbaColorToColor(hexToRgbaColor(str));
  }
  return str;
}
