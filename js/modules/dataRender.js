// ===============================
// dataRenderer.js
// ===============================
export function renderWeatherData(data, coords) {
  document.getElementById("current-latitude").textContent = `${coords.lat}°`;
  document.getElementById("current-longitude").textContent = `${coords.lon}°`;
  document.getElementById("current-temperature").textContent = `${data.temperature} °C`;
  document.getElementById("current-wind").textContent = `${data.wind} km/h`;
  document.getElementById("current-humidity").textContent = `${data.humidity}%`;
  document.getElementById("rain-probability").textContent = `${data.rainProbability}%`;
}
