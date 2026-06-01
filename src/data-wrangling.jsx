export function processClimateData(cities2025, baseline) {
  const baselineMap = new Map();

  for (const row of baseline) {
    baselineMap.set(`${row.city}-${row.day}`, row.avg_temp);
  }

  const cityMap = new Map();

  for (const city of cities2025) {
    const name = city.name;

    const times = city.daily.time;
    const temps = city.daily.temperature_2m_mean;

    const anomalies = [];

    for (let i = 0; i < times.length; i++) {
      const date = times[i];
      const day = date.slice(5);

      if (day === "02-29") continue;

      const temp = temps[i];

      const avg = baselineMap.get(`${name}-${day}`);

      anomalies.push({
        date,
        temp,
        avg_temp: avg,
        anomaly: avg != null ? temp - avg : null,
      });
    }

    cityMap.set(name, {
      name,
      country: city.country ?? "es", // fallback
      anomalies,
    });
  }

  return Array.from(cityMap.values());
}
