// ===============================
// nasaPowerService.js
// ===============================

const START = "20000101";
const END = "20251231";
const PARAMS = "T2M,WS2M,RH2M,PRECTOTCORR";

// ----------------- Utilidades internas -----------------
function yyyymmddToDate(yyyymmdd) {
  const y = Number(yyyymmdd.slice(0, 4));
  const m = Number(yyyymmdd.slice(4, 6)) - 1;
  const d = Number(yyyymmdd.slice(6, 8));
  return new Date(Date.UTC(y, m, d));
}

function getDOY(dateObj) {
  const start = new Date(Date.UTC(dateObj.getUTCFullYear(), 0, 1));
  const diff = (dateObj - start) / (1000 * 60 * 60 * 24);
  return Math.floor(diff) + 1;
}

function mean(arr) {
  if (!arr.length) return NaN;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function wrapDOY(doy) {
  if (doy <= 0) return 365 + doy;
  if (doy > 365) return doy - 365;
  return doy;
}

function pickWindowDOY(doyCenter, halfWindow = 15) {
  const days = [];
  for (let offset = -halfWindow; offset <= halfWindow; offset++) {
    days.push(wrapDOY(doyCenter + offset));
  }
  return days;
}

function safeNums(values) {
  return values.filter(v => v !== null && v !== undefined && !Number.isNaN(v));
}

// ----------------- Función principal -----------------
export async function fetchNasaAverage(lat, lon, dateISO) {
  try {
    const url =
      `https://power.larc.nasa.gov/api/temporal/daily/point` +
      `?start=${START}&end=${END}&latitude=${lat}&longitude=${lon}` +
      `&parameters=${PARAMS}&format=JSON&community=RE`;

    const res = await fetch(url);
    if (!res.ok) {
      console.error("❌ NASA POWER HTTP error:", res.status);
      throw new Error(`NASA POWER ${res.status}`);
    }

    const json = await res.json();
    const param = json?.properties?.parameter || {};
    const T2M = param.T2M || {};
    const WS2M = param.WS2M || {};
    const RH2M = param.RH2M || {};
    const PR = param.PRECTOTCORR || {};

    // Fecha seleccionada
    const selected = new Date(dateISO + "T00:00:00Z");
    let doy = getDOY(selected);
    if (doy === 366) doy = 365;
    const windowDOY = pickWindowDOY(doy, 15); // ventana ±15 días

    // Recolectar datos dentro del rango DOY
    const tVals = [];
    const wVals = [];
    const hVals = [];
    const popEvents = [];

    for (const [yyyymmdd, t] of Object.entries(T2M)) {
      const d = yyyymmddToDate(yyyymmdd);
      let dDOY = getDOY(d);
      if (dDOY === 366) dDOY = 365;
      if (!windowDOY.includes(dDOY)) continue;

      const w = WS2M[yyyymmdd];
      const h = RH2M[yyyymmdd];
      const p = PR[yyyymmdd];

      if (t !== undefined) tVals.push(Number(t));
      if (w !== undefined) wVals.push(Number(w) * 3.6); // m/s -> km/h
      if (h !== undefined) hVals.push(Number(h));
      if (p !== undefined && Number(p) >= 1.0) popEvents.push(1);
      else if (p !== undefined) popEvents.push(0);
    }

    // Calcular promedios
    const Tavg = mean(safeNums(tVals));
    const Wavg = mean(safeNums(wVals));
    const Havg = mean(safeNums(hVals));
    const pop = popEvents.length
      ? (100 * popEvents.reduce((a, b) => a + b, 0)) / popEvents.length
      : NaN;

    console.log("📡 NASA POWER promedio:", {
      temperature: Tavg,
      wind: Wavg,
      humidity: Havg,
      rainProbability: pop
    });

    // Retornar valores principales (sin estadísticas)
    return {
    temperature: Number.isFinite(Tavg) ? Number(Tavg.toFixed(1)) : "--",
    humidity: Number.isFinite(Havg) ? Math.round(Havg) : "--",
    wind: Number.isFinite(Wavg) ? Number(Wavg.toFixed(1)) : "--",
    rainProbability: Number.isFinite(pop) ? Math.round(pop) : "--",
    rawData: json.properties.parameter // 👈 nuevo campo
  };


  } catch (err) {
    console.error("❌ Error en fetchNasaAverage:", err);
    alert("Error al obtener datos climatológicos de NASA POWER.");
    return {
      temperature: "--",
      humidity: "--",
      wind: "--",
      rainProbability: "--"
    };
  }
}
