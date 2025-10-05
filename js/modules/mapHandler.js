// ===============================
// mapHandler.js
// ===============================
let map, marker, currentCoords = { lat: null, lon: null };

export function initMap() {
  // Inicializar mapa centrado en Argentina
  map = L.map("interactive-map").setView([-38.4161, -63.6167], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  // Crear marcador draggable
  marker = L.marker([-38.4161, -63.6167], { draggable: true }).addTo(map);

  // Evento: mover marcador
  marker.on("dragend", () => {
    const pos = marker.getLatLng();
    currentCoords = { lat: pos.lat.toFixed(4), lon: pos.lng.toFixed(4) };
    updateInputsFromMap();
    reverseGeocode(pos.lat, pos.lng); // autocompletar input
  });

  // Evento: clic en el mapa (mueve marcador también)
  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    currentCoords = { lat: lat.toFixed(4), lon: lng.toFixed(4) };
    updateInputsFromMap();
    reverseGeocode(lat, lng); // autocompletar input
  });

  // Evento: búsqueda manual (cuando el usuario escribe una ubicación)
  const input = document.getElementById("location-search");
  input.addEventListener("change", () => {
    searchLocation(input.value);
  });
}

export function getCurrentCoords() {
  return currentCoords;
}

// Actualiza las etiquetas Lat/Lon en el dashboard
function updateInputsFromMap() {
  document.getElementById("current-latitude").textContent = `${currentCoords.lat}°`;
  document.getElementById("current-longitude").textContent = `${currentCoords.lon}°`;
}

// 🔍 Buscar una ubicación por nombre y mover el marcador
async function searchLocation(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.length > 0) {
      const loc = data[0];
      const lat = parseFloat(loc.lat);
      const lon = parseFloat(loc.lon);
      map.setView([lat, lon], 10);
      marker.setLatLng([lat, lon]);
      currentCoords = { lat, lon };
      updateInputsFromMap();
    } else {
      alert("Ubicación no encontrada");
    }
  } catch (err) {
    console.error("Error buscando ubicación:", err);
  }
}

// 🧭 Reverse geocoding — obtener nombre del lugar desde coordenadas
async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.display_name) {
      const input = document.getElementById("location-search");

      // Opción 1: nombre completo
      // input.value = data.display_name;

      // Opción 2: versión corta (Ciudad, País)
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        "";
      const country = data.address.country || "";
      input.value = `${city}, ${country}`;
    }
  } catch (err) {
    console.error("Error en reverse geocoding:", err);
  }
}
