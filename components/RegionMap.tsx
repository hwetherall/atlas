"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import type { Ledger } from "@/lib/schema";

interface Props {
  ledger: Ledger;
  selected: string[];
  onToggle: (value: string) => void;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

// Map TopoJSON numeric IDs to our ISO-2 dimension values
const ID_TO_VALUE: Record<string, string> = {
  "528": "NL",
  "276": "DE",
  "616": "PL",
  "203": "CZ",
  "756": "CH",
  "040": "AT",
};

// Approximate center coordinates for labels [longitude, latitude]
const LABEL_COORDS: Record<string, [number, number]> = {
  "NL": [5.2913, 52.1326],
  "DE": [10.4515, 51.1657],
  "PL": [19.1451, 51.9194],
  "CZ": [15.4730, 49.8175],
  "CH": [8.2275, 46.8182],
  "AT": [14.5501, 47.5162],
};

export default function RegionMap({ ledger, selected, onToggle }: Props) {
  const { shareOf, label } = useMemo(() => {
    const shareOf = new Map<string, number>();
    const label = new Map<string, string>();
    for (const n of ledger) {
      if (n.dimension === "geography" && n.dimensionValue) {
        shareOf.set(n.dimensionValue, n.value);
        label.set(n.dimensionValue, n.label);
      }
    }
    return { shareOf, label };
  }, [ledger]);

  // Max share among the mapped countries
  const maxShare = Math.max(
    ...Object.values(ID_TO_VALUE).map((val) => shareOf.get(val) ?? 0),
    0.0001
  );
  const selectedSet = new Set(selected);

  return (
    <section className="card rounded-xl p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-2">
        Geography
      </h2>
      <p className="mt-0.5 text-xs text-ink-3">
        Shaded by market intensity. Click a country to include / exclude it.
      </p>

      <div className="mt-3 w-full">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-13, -50.5, 0],
            scale: 2000,
          }}
          width={400}
          height={300}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const value = ID_TO_VALUE[geo.id];
                const isTracked = !!value;
                
                const share = isTracked ? (shareOf.get(value) ?? 0) : 0;
                const name = isTracked ? (label.get(value) ?? value) : geo.properties.name;
                const on = isTracked && selectedSet.has(value);
                const intensity = isTracked ? share / maxShare : 0;
                
                // Sequential ramp on the accent hue (= --accent); excluded and
                // untracked land recede into warm greys on the white card.
                const fill = on
                  ? `rgba(46,107,230,${(0.3 + 0.7 * intensity).toFixed(3)})`
                  : isTracked
                    ? "#EDEAE1"
                    : "#EFEDE6";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    role={isTracked ? "checkbox" : "presentation"}
                    aria-checked={isTracked ? on : undefined}
                    aria-label={isTracked ? `${name} — ${on ? "included" : "excluded"}` : name}
                    tabIndex={isTracked ? 0 : -1}
                    onClick={() => {
                      if (isTracked) onToggle(value);
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (isTracked && (e.key === "Enter" || e.key === " ")) {
                        e.preventDefault();
                        onToggle(value);
                      }
                    }}
                    style={{
                      default: { fill, outline: "none", transition: "all 0.4s ease" },
                      hover: {
                        // Darken, don't brighten — glows read wrong on light.
                        fill: on ? fill : isTracked ? "#E3ECFB" : "#EFEDE6",
                        outline: "none",
                        filter: on ? "brightness(0.95)" : "none",
                        transition: "all 0.4s ease",
                      },
                      pressed: { fill, outline: "none" },
                    }}
                    className={[
                      isTracked ? "cursor-pointer focus-visible:stroke-accent" : "pointer-events-none",
                      on ? "stroke-funnel-yam" : isTracked ? "stroke-hairline-strong" : "stroke-white",
                    ].join(" ")}
                    strokeWidth={on ? 1 : 0.5}
                  />
                );
              })
            }
          </Geographies>
          
          {/* Render labels on top of the map */}
          {Object.entries(LABEL_COORDS).map(([value, coordinates]) => {
            const on = selectedSet.has(value);
            return (
              <Marker key={value} coordinates={coordinates}>
                <text
                  textAnchor="middle"
                  y={4}
                  // White halo keeps labels legible on any fill intensity.
                  style={{ paintOrder: "stroke", stroke: "#FFFFFF", strokeWidth: 2.5 }}
                  className={`pointer-events-none select-none text-[10px] font-medium transition-colors duration-400 ${
                    on ? "fill-ink" : "fill-ink-3"
                  }`}
                >
                  {value}
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-ink-3">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-6 rounded-sm"
            style={{
              background:
                "linear-gradient(to right, rgba(46, 107, 230, 0.3), #2e6be6)" /* = --accent ramp */,
            }}
          />
          low → high intensity
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-3 rounded-sm border border-hairline bg-[#EDEAE1]" />
          excluded
        </span>
      </div>
    </section>
  );
}
