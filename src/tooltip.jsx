export const Tooltip = ({
  interactionData,
  placement = {
    horizontal: "right",
    vertical: "bottom",
  },
}) => {
  if (!interactionData) return null;

  const { horizontal, vertical } = placement;

  const { city, date, temp, avg_temp, anomaly, x, y } = interactionData;

  const formattedDate = date
    ? new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    : "Unknown date";

  const OFFSET = 12;

  let left = x;
  let top = y;

  let transformX = "0";
  let transformY = "0";

  // Horizontal placement
  if (horizontal === "right") {
    left = x + OFFSET;
    transformX = "0";
  } else {
    left = x - OFFSET;
    transformX = "-100%";
  }

  // Vertical placement
  if (vertical === "bottom") {
    top = y + OFFSET;
    transformY = "0";
  } else {
    top = y - OFFSET;
    transformY = "-100%";
  }

  return (
    <div
      className="fixed z-50 pointer-events-none overflow-hidden rounded border border-neutral-800 shadow-lg min-w-35"
      style={{
        left,
        top,
        transform: `translate(${transformX}, ${transformY})`,
      }}
    >
      {/* Header */}
      <div className="bg-neutral-900 text-white px-2 py-1">
        <div className="text-[9px] ">{formattedDate}</div>

        <div className="font-semibold text-[11px]">{city}</div>
      </div>

      {/* Body */}
      <div className="bg-white text-black">
        <div className="flex justify-between px-2 py-1">
          <span className="text-neutral-600 text-[10px]">Temperature: </span>

          <span className="font-medium text-[10px]">
            {temp?.toFixed?.(1) ?? "N/A"}°C
          </span>
        </div>

        <div className="flex justify-between px-2 py-1 border-t border-neutral-200">
          <span className="text-neutral-600 text-[10px]">
            Baseline average:{" "}
          </span>

          <span className="font-medium text-[10px]">
            {avg_temp?.toFixed?.(1) ?? "N/A"}°C
          </span>
        </div>

        {/* Divider line */}
        <div className="h-px w-full bg-black" />

        <div className="flex justify-between px-2 py-1">
          <span className="text-neutral-700 font-bold text-[10px]">
            Anomaly:
          </span>

          <span
            className={`font-black text-[10px] ${
              anomaly > 0 ? "text-red-700" : "text-blue-800"
            }`}
          >
            {anomaly > 0 ? "+" : ""}
            {anomaly?.toFixed?.(1) ?? "N/A"}°C
          </span>
        </div>
      </div>
    </div>
  );
};
