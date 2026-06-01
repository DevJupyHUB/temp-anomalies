import { useEffect, useState } from "react";
import "./App.css";
import { CITIES } from "./cities";
import { processClimateData } from "./data-wrangling.jsx";
import baseline from "./daily_baseline.json";
import { interpolateRdBu } from "d3-scale-chromatic";
import ClimateStripes from "./stripes";

const txt = "Temperature Anomalies 2025";

export default function App() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url =
          `https://archive-api.open-meteo.com/v1/archive` +
          `?latitude=${CITIES.map((c) => c.lat).join(",")}` +
          `&longitude=${CITIES.map((c) => c.lon).join(",")}` +
          `&start_date=2025-01-01` +
          `&end_date=2025-12-31` +
          `&daily=temperature_2m_mean` +
          `&timezone=UTC`;

        const response = await fetch(url);
        const json = await response.json();

        const results = Array.isArray(json) ? json : [json];

        // Merge API response with CITIES
        const merged = results.map((res, i) => ({
          name: CITIES[i].name,
          country: CITIES[i].country,
          lat: CITIES[i].lat,
          lon: CITIES[i].lon,
          daily: res.daily,
        }));

        // Join with baseline data
        const processed = processClimateData(merged, baseline);

        // Final dataset
        setCities(processed);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-lg">Loading climate data...</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <h1 className="text-5xl font-black mb-6 text-center">
        {txt.split("").map((char, i) => (
          <span
            key={i}
            style={{
              color: interpolateRdBu(1 - i / (txt.length - 1)),
              WebkitTextStroke: "1px black",
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      <h2 className="text-sm mb-6 text-center text-neutral-500 font-bold">
        Daily temperature anomalies relative to the 2010–2024 baseline average
      </h2>

      {/* Responsive chart wrapper */}
      <div className="w-full overflow-x-auto">
        <div className="w-fit mx-auto">
          <ClimateStripes cities={cities} />
        </div>
      </div>

      {/* Data source */}
      <div className="text-center text-xs text-neutral-500 mt-4 h-6">
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-neutral-700"
        >
          Weather data by Open-Meteo.com
        </a>
      </div>
    </main>
  );
}
