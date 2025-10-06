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
  return values.filter(
    v =>
      v !== null &&
      v !== undefined &&
      !Number.isNaN(v) &&
      v > -900 // 🔹 excluye valores inválidos (-999, -9999)
  );
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

    // Fecha actual (para no usar últimos 5 días)
    const today = new Date();
    const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

    // Recolectar datos dentro del rango DOY
    const tVals = [];
    const wVals = [];
    const hVals = [];
    const popEvents = [];

    // 🔹 Contadores para depuración
    let totalCount = 0;
    let skippedInvalid = 0;
    let skippedRecent = 0;

    for (const [yyyymmdd, t] of Object.entries(T2M)) {
      const d = yyyymmddToDate(yyyymmdd);
      totalCount++;

      // 🔹 descarta últimos 5 días
      if (today - d < FIVE_DAYS_MS) {
        skippedRecent++;
        continue;
      }

      let dDOY = getDOY(d);
      if (dDOY === 366) dDOY = 365;
      if (!windowDOY.includes(dDOY)) continue;

      const w = WS2M[yyyymmdd];
      const h = RH2M[yyyymmdd];
      const p = PR[yyyymmdd];

      // 🔹 solo tomar valores válidos
      if (t !== undefined && t > -900) tVals.push(Number(t));
      else skippedInvalid++;

      if (w !== undefined && w > -900) wVals.push(Number(w) * 3.6); // m/s -> km/h
      else skippedInvalid++;

      if (h !== undefined && h > -900) hVals.push(Number(h));
      else skippedInvalid++;

      if (p !== undefined && p > -900) {
        if (Number(p) >= 1.0) popEvents.push(1);
        else popEvents.push(0);
      } else {
        skippedInvalid++;
      }
    }

    // 🔹 Mostrar resumen del filtrado
    console.log("📊 Datos NASA POWER procesados:");
    console.table({
      Total_registros: totalCount,
      Datos_validos: tVals.length,
      Invalidos_filtrados: skippedInvalid,
      Recientes_descartados: skippedRecent
    });

    // Calcular promedios
    const Tavg = mean(safeNums(tVals));
    const Wavg = mean(safeNums(wVals));
    const Havg = mean(safeNums(hVals));
    const pop = popEvents.length
      ? (100 * popEvents.reduce((a, b) => a + b, 0)) / popEvents.length
      : NaN;

    console.log("📡 NASA POWER promedio (filtrado):", {
      temperature: Tavg,
      wind: Wavg,
      humidity: Havg,
      rainProbability: pop
    });

    // Limpiar rawData aplicando Math.abs() a los valores de viento y filtrando inválidos
    const cleanRawData = { ...json.properties.parameter };
    
    // Limpiar datos de viento (WS2M) - aplicar Math.abs() y filtrar
    if (cleanRawData.WS2M) {
      const cleanWS2M = {};
      
      for (const [date, value] of Object.entries(cleanRawData.WS2M)) {
        const dateObj = yyyymmddToDate(date);
        const isRecent = today - dateObj < FIVE_DAYS_MS;
        
        if (typeof value === 'number' && value > -900 && !isRecent) {
          cleanWS2M[date] = Math.abs(value);
        }
      }
      cleanRawData.WS2M = cleanWS2M;
    }
    
    // Limpiar otros parámetros de valores inválidos y fechas recientes
    const parametersToClean = ['T2M', 'RH2M', 'PRECTOTCORR'];
    
    parametersToClean.forEach(param => {
      if (cleanRawData[param]) {
        const cleanParam = {};
        for (const [date, value] of Object.entries(cleanRawData[param])) {
          const dateObj = yyyymmddToDate(date);
          const isRecent = today - dateObj < FIVE_DAYS_MS;
          
          if (typeof value === 'number' && value > -900 && !isRecent) {
            cleanParam[date] = value;
          }
        }
        cleanRawData[param] = cleanParam;
      }
    });

    // Retornar valores principales (sin estadísticas)
    return {
      temperature: Number.isFinite(Tavg) ? Number(Tavg.toFixed(1)) : "--",
      humidity: Number.isFinite(Havg) ? Math.round(Havg) : "--",
      wind: Number.isFinite(Wavg) ? Number(Math.abs(Wavg).toFixed(1)) : "--",
      rainProbability: Number.isFinite(pop) ? Math.round(pop) : "--",
      rawData: cleanRawData // 👈 datos crudos con viento limpio
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
