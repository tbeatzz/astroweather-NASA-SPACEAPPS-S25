# 🌌 AstroWeather

**AstroWeather** es una aplicación web desarrollada para el **NASA Space Apps Challenge 2025**, que combina datos meteorológicos y científicos provenientes de **Open-Meteo** y **NASA POWER**.  
Su objetivo es ofrecer un panel interactivo que muestre **condiciones actuales, estimaciones históricas y análisis deportivos personalizados** en función del clima.

---

## 🚀 Descripción General

AstroWeather permite consultar datos climáticos en cualquier punto del mapa y para cualquier fecha hasta **un año en el futuro**.  
La aplicación selecciona automáticamente la fuente de datos más adecuada:

- **Open-Meteo API** → para pronósticos de **0 a 5 días**.  
- **NASA POWER API** → para estimaciones históricas a partir de **6 días o más**.

Además, incluye módulos adicionales:
- **Análisis deportivo:** evalúa la conveniencia de practicar deportes al aire libre según las condiciones meteorológicas.  
- **Visualización NASA:** genera gráficos históricos por variable (temperatura, humedad, viento o precipitación) para el día seleccionado.  
- **Exportación de datos:** permite descargar los resultados en formato **JSON** o **CSV**.

---

## 🧠 Procesamiento y Tratamiento de Datos

Los datos recibidos de las APIs son procesados para garantizar precisión y coherencia:

- Se excluyen las mediciones de los **últimos 5 días** por posible inconsistencia.  
- Se calcula un **promedio histórico por día y mes** en distintos años para obtener estimaciones fiables.  
- El viento se transforma a **km/h** y se normaliza en valor absoluto.  
- Todos los resultados se redondean y se devuelven en un formato uniforme.

---

## 🧩 Estructura del Proyecto

```
/astroweather
│
├── index.html                 # Estructura principal del dashboard
├── /js
│   ├── main.js                # Script principal y punto de entrada
│   ├── /modules
│   │   ├── apiSelector.js     # Lógica para elegir la API correcta
│   │   ├── mapHandler.js      # Gestión del mapa interactivo
│   │   ├── openMeteoService.js# Integración con Open-Meteo API
│   │   ├── nasaPowerService.js# Integración con NASA POWER API (filtrado y media histórica)
│   │   ├── dataRender.js      # Renderizado de datos principales en el dashboard
│   │   ├── nasaGraph.js       # Gráfico histórico con Chart.js
│   │   ├── sportAnalyzer.js   # Evaluación de condiciones deportivas
│   │   └── utils.js           # Funciones auxiliares
│
├── /css
│   └── style.css              # Estilos del dashboard
│
└── /assets                    # Imágenes, íconos y otros recursos
```

---

## 🌍 APIs Utilizadas


| **Open-Meteo API** | Datos meteorológicos en tiempo real y predicciones a corto plazo. | [https://open-meteo.com](https://open-meteo.com) |
| **NASA POWER API** | Datos históricos climáticos y energéticos (2000–2025). | [https://power.larc.nasa.gov](https://power.larc.nasa.gov) |

---

## 🧮 Funcionalidades Clave

- 🌡️ **Condiciones actuales**: temperatura, viento, humedad y probabilidad de lluvia.  
- 🛰️ **Estimaciones históricas**: promedios diarios calculados a partir de 25 años de datos NASA.  
- 🏃 **Análisis deportivo**: puntaje y recomendaciones por deporte según el clima.  
- 📊 **Gráfico histórico NASA**: evolución de una variable meteorológica a lo largo de los años.  
- 💾 **Exportación de datos**: descarga de resultados en JSON o CSV.  
- 🗺️ **Mapa interactivo**: selección dinámica de ubicaciones por clic o búsqueda.  
- 🌐 **Traducción dinámica** (opcional con Google Translate Widget).

---

## ⚙️ Instalación y Ejecución

1. Cloná el repositorio:
   ```bash
   git clone https://github.com/tuusuario/astroweather.git
   cd astroweather
   ```
2. Abrí el archivo `index.html` en tu navegador con Live Server (VS Code recomendado):
   ```bash
   npx live-server
   ```
3. Listo 🚀: el dashboard se cargará con todas las funcionalidades activas.

---

## 📦 Dependencias

- [**Leaflet.js**](https://leafletjs.com/) – Mapa interactivo.  
- [**Chart.js**](https://www.chartjs.org/) – Gráficos meteorológicos.  
- [**Bootstrap 5**](https://getbootstrap.com/) – Diseño y componentes responsivos.  
- [**Font Awesome**](https://fontawesome.com/) – Íconos del dashboard.

---

## 🧑‍💻 Autores

Proyecto desarrollado por el equipo de **Algoritmo de guanaco** para el  
**NASA Space Apps Challenge 2025**.  

- 🧠 *Ignacio, Morales Jumilla, Ivan Reales, Camila Aballay, Rosita Mansilla, Alan Titos* 


---
## 💫 Enlace del Proyecto

🌐 (https://tuusuario.github.io/astroweather/)
