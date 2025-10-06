// ===============================
// climateStatsRenderer.js
// ===============================
export function renderClimateStats(stats) {
  const el = document.getElementById("climate-stats");
  if (!el || !stats) return;

  const fmt = (x, digits = 1) => (x === null || x === undefined || Number.isNaN(x) ? "--" : Number(x).toFixed(digits));
  const pct = (x) => (x === null || x === undefined || Number.isNaN(x) ? "--" : `${Math.round(x)}%`);

  const { temperature, humidity, wind, precipitation, meta } = stats;

  el.innerHTML = `
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5 class="mb-3"><i class="fas fa-chart-area me-2"></i>Climatología histórica (2000–2025)</h5>

        <div class="table-responsive">
          <table class="table table-sm align-middle">
            <thead>
              <tr>
                <th>Variable</th>
                <th>P10</th>
                <th>P50 (mediana)</th>
                <th>P90</th>
                <th>Media</th>
                <th>Desvío</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Temperatura (°C)</td>
                <td>${fmt(temperature.p10)}</td>
                <td><strong>${fmt(temperature.p50)}</strong></td>
                <td>${fmt(temperature.p90)}</td>
                <td>${fmt(temperature.mean)}</td>
                <td>${fmt(temperature.std)}</td>
              </tr>
              <tr>
                <td>Humedad (%)</td>
                <td>${fmt(humidity.p10, 0)}</td>
                <td><strong>${fmt(humidity.p50, 0)}</strong></td>
                <td>${fmt(humidity.p90, 0)}</td>
                <td>${fmt(humidity.mean, 0)}</td>
                <td>${fmt(humidity.std, 0)}</td>
              </tr>
              <tr>
                <td>Viento (km/h)</td>
                <td>${fmt(Math.abs(wind.p10))}</td>
                <td><strong>${fmt(Math.abs(wind.p50))}</strong></td>
                <td>${fmt(Math.abs(wind.p90))}</td>
                <td>${fmt(Math.abs(wind.mean))}</td>
                <td>${fmt(Math.abs(wind.std))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="row g-3 mt-2">
          <div class="col-md-4">
            <div class="p-2 rounded bg-light border">
              <div class="small text-muted">Prob. histórica de lluvia (≥ 1 mm)</div>
              <div class="fs-5"><strong>${pct(precipitation.pop)}</strong></div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-2 rounded bg-light border">
              <div class="small text-muted">Ventana alrededor del DOY</div>
              <div class="fs-6">${meta.windowDays} días (±${Math.floor(meta.windowDays/2)})</div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="p-2 rounded bg-light border">
              <div class="small text-muted">Muestras usadas</div>
              <div class="fs-6">${meta.sampleSize} días</div>
            </div>
          </div>
        </div>

        <div class="mt-3 small text-muted">
          Estimación climatológica por día del año (DOY=${meta.doy}). No es un pronóstico determinista; muestra rangos típicos (P10–P90) basados en 2000–2025.
        </div>
      </div>
    </div>
  `;
}

export function clearClimateStats() {
  const el = document.getElementById("climate-stats");
  if (el) el.innerHTML = "";
}
