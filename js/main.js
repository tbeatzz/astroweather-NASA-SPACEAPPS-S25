// ===============================
// main.js
// ===============================
import { initMap, getCurrentCoords } from "./modules/mapHandler.js";
import { selectAPI } from "./modules/apiSelector.js";
import { fetchOpenMeteoData } from "./modules/openMeteoService.js";
import { fetchNasaAverage } from "./modules/nasaPowerService.js";
import { renderWeatherData } from "./modules/dataRender.js";
import { analyzeSportConditions } from "./modules/sportAnalyzer.js";
import { renderNasaGraph } from "./modules/nasaGraph.js"; // ✅ nuevo módulo gráfico

import { getDiffDays } from "./modules/utils.js";

let currentLocation = null;
let weatherData = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌤️ Dashboard iniciado");
  initMap();

  // ===============================
  // Fecha mínima = hoy
  // ===============================
  const datoFecha = document.getElementById("datoFecha");
  const hoy = new Date();

  // Fecha mínima = hoy
  const min = hoy.toISOString().split("T")[0];

  // Fecha máxima = dentro de un año
  const unAnioDespues = new Date(hoy);
  unAnioDespues.setFullYear(hoy.getFullYear() + 1);
  const max = unAnioDespues.toISOString().split("T")[0];

  // Asigna los atributos al input
  if (datoFecha) {
    datoFecha.setAttribute("min", min);
    datoFecha.setAttribute("max", max);
  }

  const btnBuscar = document.getElementById("linkBus");

  // ===============================
  // Análisis deportivo
  // ===============================
  document.getElementById("analyze-sport").addEventListener("click", () => {
    const sport = document.getElementById("sport-select").value;
    const resultsEl = document.getElementById("sports-results");
    const scoreEl = document.getElementById("sport-score-value");
    const msgEl = document.getElementById("sport-recommendation");
    const condEl = document.getElementById("sport-conditions");
    const tipsEl = document.getElementById("sport-tips-list");

    const temp = parseFloat(document.getElementById("current-temperature").textContent) || null;
    const hum = parseFloat(document.getElementById("current-humidity").textContent) || null;
    const wind = parseFloat(document.getElementById("current-wind").textContent) || null;
    const rain = parseFloat(document.getElementById("rain-probability").textContent) || null;

    const data = { temperature: temp, humidity: hum, wind, rainProbability: rain };
    const result = analyzeSportConditions(data, sport);

    scoreEl.textContent = result.score;
    msgEl.textContent = result.message;
    condEl.textContent = `Condiciones actuales para ${sport}`;
    tipsEl.innerHTML = "";
    result.tips.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      tipsEl.appendChild(li);
    });

    resultsEl.style.display = "block";
  });

  // ===============================
  // Búsqueda de datos meteorológicos
  // ===============================
  if (btnBuscar) {
    btnBuscar.addEventListener("click", async () => {
      const fecha = document.getElementById("datoFecha").value;
      const hora = document.getElementById("datoHora").value || null;
      const coords = getCurrentCoords();

      if (!coords?.lat || !coords?.lon || !fecha) {
        alert("Por favor, selecciona una ubicación y fecha válidas.");
        return;
      }

      const diffDays = getDiffDays(fecha);
      const api = selectAPI(diffDays);

      try {
        const fetched = (api === "openmeteo")
          ? await fetchOpenMeteoData(coords.lat, coords.lon, fecha, hora)
          : await fetchNasaAverage(coords.lat, coords.lon, fecha);

        weatherData = fetched;
        currentLocation = {
          name: document.getElementById("location-search")?.value || `Lat ${coords.lat}, Lon ${coords.lon}`,
          lat: coords.lat,
          lon: coords.lon
        };

        renderWeatherData(weatherData, coords);

        // ===============================
        // 📊 Mostrar gráfico NASA solo si se usa esa API
        // ===============================
        if (api === "nasa") {
          const variableSelect = document.getElementById("nasa-variable");
          const selectedVar = variableSelect?.value || "T2M";
          renderNasaGraph(weatherData.rawData, selectedVar, new Date(fecha));

          // Re-renderizar si cambia la variable
          variableSelect?.addEventListener("change", () => {
            renderNasaGraph(weatherData.rawData, variableSelect.value, new Date(fecha));
          });
        }

      } catch (error) {
        console.error("❌ Error al obtener o renderizar datos:", error);
        alert("Ocurrió un error al consultar los datos. Intenta nuevamente o cambia la ubicación.");
      }
    });
  }

  // ===============================
  // Exportar datos
  // ===============================
  const botonCSV = document.getElementById("export-csv");
  const botonJSON = document.getElementById("export-json");
  if (botonCSV) botonCSV.addEventListener("click", exportCSV);
  if (botonJSON) botonJSON.addEventListener("click", exportJSON);

  //Llamada al InicializateMap:
  initializeDateTime();
});

/* -------------------------
   Helpers para exportación
   ------------------------- */
function _safeNumberFrom(value) {
  if (value == null) return "N/A";
  const n = parseFloat(value);
  return Number.isNaN(n) ? "N/A" : n;
}

function exportJSON() {
  if (!weatherData || !currentLocation) {
    alert("Primero obtené los datos meteorológicos antes de exportar.");
    return;
  }

  const dataToExport = {
    location: currentLocation,
    weather: weatherData,
    timestamp: new Date().toISOString(),
    source: "AstroWeather NASA Space Apps Challenge"
  };

  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `astroweather-data-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCSV() {
  if (!weatherData || !currentLocation) {
    alert("Primero obtené los datos meteorológicos antes de exportar.");
    return;
  }

  const temp = weatherData?.current?.temperature ?? weatherData?.temperature ?? null;
  const hum = weatherData?.current?.humidity ?? weatherData?.humidity ?? null;
  const wind = weatherData?.current?.windSpeed ?? weatherData?.wind ?? null;
  const rain = weatherData?.current?.rainProbability ?? weatherData?.rainProbability ?? null;

  const headers = ["Date", "Location", "Latitude", "Longitude", "Temperature", "Humidity", "Wind Speed", "Rain Probability"];
  const now = new Date();
  const row = [
    now.toISOString().split("T")[0],
    `"${currentLocation.name}"`,
    currentLocation.lat,
    currentLocation.lon,
    _safeNumberFrom(temp),
    _safeNumberFrom(hum),
    _safeNumberFrom(wind),
    _safeNumberFrom(rain)
  ];

  const csvContent = [headers.join(","), row.join(",")].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `astroweather-data-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ============= FECHA Y HORA EN TIEMPO REAL =============
async function initializeDateTime() {
  updateDateTime();

  // Actualizar cada segundo
  setInterval(updateDateTime, 1000);
}

function updateDateTime() {
  const now = new Date();

  // Formatear hora
  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const timeString = now.toLocaleTimeString('es-AR', timeOptions);

  // Formatear fecha
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  // Actualizar DOM
  const timeElement = document.getElementById('current-time');
  const dateElement = document.getElementById('current-date');

  if (timeElement) timeElement.textContent = timeString;
  //if (dateElement) dateElement.textContent = dateString;
}

