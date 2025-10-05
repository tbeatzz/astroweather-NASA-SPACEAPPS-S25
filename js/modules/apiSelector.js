// ===============================
// apiSelector.js
// ===============================
export function selectAPI(diffDays) {
  const statusEl = document.getElementById("api-status");

  if (diffDays <= 5) {
    statusEl.innerHTML = `
      <span class="badge bg-success">
        <i class="fas fa-cloud me-1"></i> API: Open-Meteo (≤ 5 días)
      </span>`;
    return "openmeteo";
  } else {
    statusEl.innerHTML = `
      <span class="badge bg-info">
        <i class="fas fa-satellite me-1"></i> API: NASA POWER (estimación histórica)
      </span>`;
    return "nasa";
  }
}
