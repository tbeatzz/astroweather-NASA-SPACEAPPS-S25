// ===============================
// climateChart.js
// ===============================
import ApexCharts from "https://cdn.jsdelivr.net/npm/apexcharts/dist/apexcharts.esm.js";

export function renderClimateChart(stats) {
  const el = document.getElementById("nasa-chart");
  if (!el || !stats) return;

  const categories = ["Temperatura", "Humedad", "Viento"];
  const p10 = [stats.temperature.p10, stats.humidity.p10, stats.wind.p10];
  const p50 = [stats.temperature.p50, stats.humidity.p50, stats.wind.p50];
  const p90 = [stats.temperature.p90, stats.humidity.p90, stats.wind.p90];

  const options = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false }
    },
    title: {
      text: "Distribución Climatológica (P10 - P50 - P90)",
      align: "center",
      style: { fontSize: "14px", color: "#444" }
    },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "45%", endingShape: "rounded" }
    },
    dataLabels: { enabled: false },
    xaxis: { categories },
    yaxis: { title: { text: "Valor medio" } },
    colors: ["#c9d6ff", "#5b8def", "#c9d6ff"],
    series: [
      { name: "P10", data: p10 },
      { name: "P50 (Mediana)", data: p50 },
      { name: "P90", data: p90 }
    ],
    legend: {
      position: "top",
      horizontalAlign: "center"
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light"
    }
  };

  const chart = new ApexCharts(el, options);
  chart.render();
}
