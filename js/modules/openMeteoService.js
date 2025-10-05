// ===============================
// openMeteoService.js
// ===============================
export async function fetchOpenMeteoData(lat, lon, date, hour) {
  try {
    // Convertir fecha al formato correcto (YYYY-MM-DD)
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // API OpenMeteo
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,precipitation_probability&start_date=${formattedDate}&end_date=${formattedDate}&timezone=auto`;

    const res = await fetch(url);

    if (!res.ok) {
      console.error("❌ OpenMeteo error HTTP:", res.status);
      throw new Error(`Error ${res.status} al consultar Open-Meteo`);
    }

    const data = await res.json();

    // Validar que existan datos
    if (!data.hourly) {
      console.error("⚠️ OpenMeteo no devolvió datos válidos:", data);
      throw new Error("Sin datos meteorológicos disponibles para la fecha seleccionada.");
    }

    // Elegimos una hora representativa (por defecto 12:00 si no se eligió hora)
    let idx = 12;
    if (hour) {
      const [h] = hour.split(":");
      idx = parseInt(h, 10);
    }

    // Evitar fuera de rango
    if (idx >= data.hourly.temperature_2m.length) idx = 12;

    return {
      temperature: data.hourly.temperature_2m[idx],
      humidity: data.hourly.relative_humidity_2m[idx],
      wind: data.hourly.windspeed_10m[idx],
      rainProbability: data.hourly.precipitation_probability[idx]
    };

  } catch (error) {
    console.error("❌ Error en fetchOpenMeteoData:", error);
    alert("No se pudieron obtener los datos meteorológicos. Intenta otra ubicación o fecha cercana.");
    return {
      temperature: "--",
      humidity: "--",
      wind: "--",
      rainProbability: "--"
    };
  }
}
