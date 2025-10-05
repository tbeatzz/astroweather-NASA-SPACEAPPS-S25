// ===============================
// sportAnalyzer.js
// ===============================

/**
 * Evalúa las condiciones climáticas para distintos deportes
 * @param {Object} data - Datos meteorológicos (temperature, humidity, wind, rainProbability)
 * @param {string} sport - Nombre del deporte ("futbol", "running", etc.)
 * @returns {Object} Resultado con puntaje, recomendación y consejos
 */
export function analyzeSportConditions(data, sport) {
  const { temperature, humidity, wind, rainProbability } = data;

  // Si no hay datos válidos
  if (!temperature || temperature === "--") {
    return {
      score: 0,
      message: "No hay datos meteorológicos disponibles.",
      tips: ["Selecciona una ubicación y vuelve a intentarlo."]
    };
  }

  // Configuración de rangos óptimos por deporte
  const sportProfiles = {
    futbol: {
      temp: [10, 25],
      humidity: [30, 70],
      windMax: 30,
      rainMax: 40
    },
    tenis: {
      temp: [15, 28],
      humidity: [30, 65],
      windMax: 25,
      rainMax: 30
    },
    ciclismo: {
      temp: [12, 30],
      humidity: [20, 75],
      windMax: 35,
      rainMax: 40
    },
    natacion: {
      temp: [20, 35],
      humidity: [40, 80],
      windMax: 20,
      rainMax: 20
    },
    running: {
      temp: [8, 24],
      humidity: [30, 65],
      windMax: 25,
      rainMax: 40
    },
    golf: {
      temp: [15, 30],
      humidity: [30, 70],
      windMax: 20,
      rainMax: 30
    }
  };

  const profile = sportProfiles[sport];
  if (!profile) {
    return { score: 0, message: "Deporte no reconocido.", tips: [] };
  }

  // Funciones auxiliares
  const scoreInRange = (value, [min, max]) => {
    if (value < min) return Math.max(0, 100 - (min - value) * 4);
    if (value > max) return Math.max(0, 100 - (value - max) * 4);
    return 100;
  };

  const scoreWind = Math.max(0, 100 - (wind / profile.windMax) * 100);
  const scoreRain = Math.max(0, 100 - (rainProbability / profile.rainMax) * 100);
  const scoreTemp = scoreInRange(temperature, profile.temp);
  const scoreHum = scoreInRange(humidity, profile.humidity);

  // Promedio ponderado (temperatura y lluvia pesan más)
  const totalScore = Math.round(
    (scoreTemp * 0.35 + scoreHum * 0.25 + scoreWind * 0.15 + scoreRain * 0.25)
  );

  // Interpretación
  let message, tips = [];

  if (totalScore >= 80) {
    message = "Excelente momento para practicar.";
    tips.push("Hidratate y disfrutá del clima ideal.");
    tips.push("Usá ropa liviana y protección solar.");
  } else if (totalScore >= 60) {
    message = "Buenas condiciones, con algunas precauciones.";
    tips.push("Chequeá la velocidad del viento antes de salir.");
    tips.push("Evitá exponerte en exceso si hay humedad alta.");
  } else if (totalScore >= 40) {
    message = "Condiciones regulares, puede no ser ideal.";
    tips.push("Hacé pausas frecuentes y controlá tu ritmo.");
    tips.push("Evitá horarios de calor extremo o lluvia inminente.");
  } else {
    message = "No se recomienda practicar al aire libre.";
    tips.push("Esperá a que mejoren las condiciones meteorológicas.");
    tips.push("Optá por entrenamiento indoor o ejercicios suaves.");
  }

  return { score: totalScore, message, tips };
}
