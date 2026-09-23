/* Small shared helpers and colour constants. */
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const fmt = n => {
  if (n == null || isNaN(n)) return "–";
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, "") + "K";
  return String(Math.round(n));
};
export const full = n => Math.round(n).toLocaleString("en-US");
export const store = {
  get(k) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};
export const PALETTE = ["#8ab661","#ef6f4a","#e83f6f","#9aa3b5","#6fd3f7","#2ec4b6","#ff8fc7","#f2b134","#b86bd9","#4d7cfe","#d98a3d","#3fa34d"];
export const OTHER_COLOR = "#7d8499";
export const RAMP = ["#5b6cff", "#d65db1", "#ffb347"];

export function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } const r = mulberry32(h); return [r(), r(), r()]; }
