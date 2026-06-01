import { useState } from "react";
import { scaleSequential } from "d3-scale";
import { interpolateRdBu } from "d3-scale-chromatic";
import { Tooltip } from "./tooltip";

export default function ClimateStripes({ cities }) {
  const [cursor, setCursor] = useState(null);

  const colorScale = scaleSequential()
    .domain([8, -8])
    .interpolator(interpolateRdBu);

  const updateTooltip = (e, city, d) => {
    setCursor({
      city: city.name,
      date: d.date,
      temp: d.temp,
      avg_temp: d.avg_temp,
      anomaly: d.anomaly,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const hideTooltip = () => {
    setCursor(null);
  };

  return (
    <>
      <div className="space-y-1">
        {cities.map((city) => (
          <div key={city.name} className="flex items-center gap-1">
            {/* Label with flag */}
            <div
              className="
                sticky left-0 z-30 bg-neutral-100
                w-20 md:w-28 lg:w-32
                text-xs md:text-sm
                flex items-center
                gap-1 md:gap-2
                shrink-0
              "
            >
              <img
                src={`https://flagcdn.com/w20/${city.country}.png`}
                alt={city.country}
                className="w-4 md:w-5 h-auto rounded-sm"
              />

              <span>{city.name}</span>
            </div>

            {/* Stripes */}
            <div className="flex h-4 md:h-6 lg:h-8">
              {city.anomalies.map((d) => (
                <div
                  key={d.date}
                  className="w-0.5 h-full"
                  style={{
                    backgroundColor: colorScale(d.anomaly),
                  }}
                  onMouseMove={(e) => updateTooltip(e, city, d)}
                  onMouseLeave={hideTooltip}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Tooltip
        interactionData={cursor}
        placement={{
          horizontal: cursor?.x < window.innerWidth / 2 ? "right" : "left",
          vertical: cursor?.y < window.innerHeight / 2 ? "bottom" : "top",
        }}
      />
    </>
  );
}
