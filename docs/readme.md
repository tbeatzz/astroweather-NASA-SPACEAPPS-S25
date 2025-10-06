# 🌌 AstroWeather

**AstroWeather** is a web application developed for the **NASA Space Apps Challenge 2025**, combining meteorological and scientific data from **Open-Meteo** and **NASA POWER**.  
Its goal is to provide an interactive dashboard displaying **current conditions, historical estimates, and personalized sports analysis** based on weather data.

---

## 🚀 Overview

AstroWeather allows users to query weather data for any point on the map and for any date up to **one year into the future**.  
The app automatically selects the most suitable data source:

- **Open-Meteo API** → for forecasts of **0 to 5 days**.  
- **NASA POWER API** → for historical-based estimates from **6 days onward**.

Additionally, it includes the following modules:
- **Sports Analysis:** evaluates the suitability of outdoor sports based on weather conditions.  
- **NASA Visualization:** generates historical charts by variable (temperature, humidity, wind, or precipitation) for the selected day.  
- **Data Export:** allows users to download results in **JSON** or **CSV** format.

---

## 🧠 Data Processing and Treatment

The data retrieved from the APIs is processed to ensure accuracy and consistency:

- Measurements from the **last 5 days** are excluded due to potential inconsistencies.  
- A **historical average by day and month** across multiple years is calculated for reliable estimates.  
- Wind data is converted to **km/h** and normalized to absolute values.  
- All results are rounded and returned in a standardized format.

---

## 🧩 Project Structure

```
/astroweather
│
├── index.html                 # Main dashboard structure
├── /js
│   ├── main.js                # Main script and entry point
│   ├── /modules
│   │   ├── apiSelector.js     # Logic to choose the correct API
│   │   ├── mapHandler.js      # Interactive map management
│   │   ├── openMeteoService.js# Integration with Open-Meteo API
│   │   ├── nasaPowerService.js# Integration with NASA POWER API (filtering and historical averages)
│   │   ├── dataRender.js      # Renders main dashboard data
│   │   ├── nasaGraph.js       # Historical chart using Chart.js
│   │   ├── sportAnalyzer.js   # Sports condition evaluation
│   │   └── utils.js           # Helper functions
│
├── /css
│   └── style.css              # Dashboard styles
│
└── /assets                    # Images, icons, and other resources
```

---

## 🌍 APIs Used

| **API** | **Description** | **Link** |
|----------|------------------|-----------|
| **Open-Meteo API** | Real-time weather data and short-term forecasts. | [https://open-meteo.com](https://open-meteo.com) |
| **NASA POWER API** | Historical climate and energy data (2000–2025). | [https://power.larc.nasa.gov](https://power.larc.nasa.gov) |

---

## 🧮 Key Features

- 🌡️ **Current Conditions:** temperature, wind, humidity, and rain probability.  
- 🛰️ **Historical Estimates:** daily averages computed from 25 years of NASA data.  
- 🏃 **Sports Analysis:** scores and recommendations for outdoor sports based on weather.  
- 📊 **NASA Historical Chart:** evolution of a weather variable over the years.  
- 💾 **Data Export:** download results in JSON or CSV.  
- 🗺️ **Interactive Map:** dynamic location selection by click or search.  
- 🌐 **Dynamic Translation** (optional via Google Translate Widget).

---

## ⚙️ Installation and Run

1. Clone the repository:
   ```bash
   git clone https://github.com/tbeatzz/astroweather-NASA-SPACEAPPS-S25.git
   cd astroweather
   ```
2. Open the `index.html` file in your browser using Live Server (recommended with VS Code):
   ```bash
   npx live-server
   ```
3. Done 🚀 — the dashboard will load with all features enabled.

---

## 📦 Dependencies

- [**Leaflet.js**](https://leafletjs.com/) – Interactive map.  
- [**Chart.js**](https://www.chartjs.org/) – Weather data charts.  
- [**Bootstrap 5**](https://getbootstrap.com/) – Responsive design and UI components.  
- [**Font Awesome**](https://fontawesome.com/) – Dashboard icons.

---

## 🧑‍💻 Authors

Project developed by the **Algoritmo de Guanaco** team for the  
**NASA Space Apps Challenge 2025**.  

- 🧠 *Ignacio Morales Jumilla, Ignacio Leguizamón, Iván Reales, Camila Aballay, Rosita Mansilla, Alan Titos*

---

## 💫 Project Link

🌐(http://astroweather.earth/)
