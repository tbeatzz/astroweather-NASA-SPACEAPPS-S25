// ===============================
// nasaGraph.js
// ===============================

import { getDOY, yyyymmddToDate } from "./utils.js";

let chartInstance = null;

/**
 * Genera gráfico histórico NASA POWER para una variable
 * @param {Object} data - JSON de NASA POWER (json.properties.parameter)
 * @param {string} variable - Clave NASA ("T2M", "WS2M", "RH2M", "PRECTOTCORR")
 * @param {Date} selectedDate - Fecha seleccionada
 */
export function renderNasaGraph(data, variable, selectedDate) {
  const ctx = document.getElementById("nasa-chart");
  if (!ctx || !data[variable]) {
    console.warn("⚠️ No hay datos válidos para graficar", variable);
    return;
  }

  const param = data[variable];
  const doy = getDOY(selectedDate);
  const window = [];
  for (let offset = -15; offset <= 15; offset++) window.push(doy + offset);

  const yearValues = {};

  for (const [yyyymmdd, val] of Object.entries(param)) {
    const date = yyyymmddToDate(yyyymmdd);
    const year = date.getUTCFullYear();
    const dDOY = getDOY(date);
    if (window.includes(dDOY)) {
      if (!yearValues[year]) yearValues[year] = [];
      yearValues[year].push(Number(val));
    }
  }

  const years = Object.keys(yearValues).map(Number).sort((a, b) => a - b);
  const means = years.map(y => {
    const vals = yearValues[y];
    return vals.length ? vals.reduce((a, b) => a + b) / vals.length : null;
  });

  // Convertir unidades si es viento
  const label = {
    T2M: "Temperatura (°C)",
    WS2M: "Viento (km/h)",
    RH2M: "Humedad (%)",
    PRECTOTCORR: "Precipitación (mm)"
  }[variable];

  const dataSeries = variable === "WS2M" ? means.map(v => v * 3.6) : means;

  // Destruir gráfico previo si existe
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: label,
          data: dataSeries,
          fill: true,
          borderColor: "#007bff",
          backgroundColor: "rgba(0,123,255,0.2)",
          tension: 0.3,
          pointRadius: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio :false,
      scales: {
        x: {
          title: { display: true, text: "Años" }
        },
        y: {
          title: { display: true, text: label }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.y.toFixed(2)}`
          }
        }
      }
    }
  });
}
