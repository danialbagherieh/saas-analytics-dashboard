// src/components/GeoMap.tsx
import { useEffect, useState } from "react";
import { ResponsiveGeoMap } from "@nivo/geo";

// ============================================================
// Local type definitions (no external file needed)
// ============================================================
type GeoProps = Record<string, unknown>;

interface Geometry {
  type: string;
  coordinates: unknown; // we never access coordinates, so 'unknown' is fine
}

interface Feature {
  type: string;
  geometry: Geometry | null;
  properties: GeoProps;
  id?: string | number;
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

// ============================================================
// Legend component
// ============================================================
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 14,
          height: 14,
          background: color,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.12)",
        }}
      />
      <div style={{ fontSize: 13, color: "#333" }}>{label}</div>
    </div>
  );
}

// ============================================================
// Main component – return type removed to avoid JSX namespace error
// ============================================================
export default function GeoMap() {
  const [world, setWorld] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Remove Antarctica from the data
  const removeAntarctica = (fc: FeatureCollection): FeatureCollection => {
    const before = fc.features.length;
    const filtered = {
      ...fc,
      features: fc.features.filter((f) => {
        const p = f.properties as Record<string, unknown> | undefined;
        const name =
          (p?.name as string | undefined) ||
          (p?.admin as string | undefined) ||
          (p?.subunit as string | undefined) ||
          "";
        const iso =
          (p?.iso_a3 as string | undefined) ||
          (p?.adm0_a3 as string | undefined) ||
          "";
        return name !== "Antarctica" && iso !== "ATA";
      }),
    };
    console.log(
      `removeAntarctica: removed ${before - filtered.features.length} features (Antarctica)`,
    );
    return filtered;
  };

  // Fetch GeoJSON data
  useEffect(() => {
    const url =
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson";

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as unknown;
      })
      .then((data: unknown) => {
        // Validate data structure
        if (
          typeof data === "object" &&
          data !== null &&
          "type" in data &&
          (data as { type?: unknown }).type === "FeatureCollection" &&
          "features" in data &&
          Array.isArray((data as { features?: unknown }).features)
        ) {
          const fc = data as FeatureCollection;
          // Basic feature validation
          const valid = fc.features.every(
            (f) =>
              typeof f === "object" &&
              f !== null &&
              "geometry" in f &&
              "type" in f &&
              "properties" in f,
          );
          if (valid) {
            const filtered = removeAntarctica(fc);
            setWorld(filtered);
            setError(null);
            return;
          }
        }
        throw new Error(
          "Fetched data is not a valid GeoJSON FeatureCollection",
        );
      })
      .catch((err) => {
        console.error("Failed to load geojson", err);
        setError(String(err));
        setWorld(null);
      });
  }, []);

  if (error) {
    return (
      <div style={{ padding: 16 }}>
        <strong>Map error:</strong> {error}
      </div>
    );
  }

  if (!world) return <div>Loading map...</div>;

  // ============================================================
  // Static data for colors and statistics
  // ============================================================
  const colorMap: Record<string, string> = {
    England: "#d32f2f",
    Germany: "#d32f2f",
    USA: "#2e7d32",
    Canada: "#ed6c02",
  };

  const statsMap: Record<
    string,
    { flag: string; users: string; orders: string; revenue: string }
  > = {
    USA: {
      flag: "🇺🇸",
      users: "128,450",
      orders: "34,920",
      revenue: "$4,860,000",
    },
    Canada: {
      flag: "🇨🇦",
      users: "22,380",
      orders: "5,140",
      revenue: "$610,000",
    },
    England: {
      flag: "🏴",
      users: "6,374",
      orders: "3,243",
      revenue: "$220,000",
    },
    Germany: {
      flag: "🇩🇪",
      users: "4,380",
      orders: "2,310",
      revenue: "$180,200",
    },
  };

  // ============================================================
  // Helper functions
  // ============================================================
  const getFeatureKey = (feature: Feature): string | null => {
    const p = feature.properties;
    if (!p) return null;
    const candidates = [
      p.iso_a3,
      p.ISO_A3,
      p.iso3,
      p.adm0_a3,
      p.adm0_a3_us,
      p.id,
      p.name,
      p.name_en,
      p.admin,
      p["ISO_A3"],
    ];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim().length > 0) return c;
    }
    return null;
  };

  const fillColor = (feature: Feature | undefined): string => {
    if (!feature) return "#E0E0E0";
    const key = getFeatureKey(feature);
    if (!key) return "#E0E0E0";
    if (key in colorMap) return colorMap[key];
    const up = String(key).toUpperCase();
    if (up in colorMap) return colorMap[up];
    const low = String(key).toLowerCase();
    for (const mapKey of Object.keys(colorMap)) {
      if (mapKey.toLowerCase() === low) return colorMap[mapKey];
    }
    return "#E0E0E0";
  };

  const parseNumber = (s: string | undefined): number => {
    if (!s) return 0;
    const digits = String(s).replace(/[^0-9.-]+/g, "");
    const n = Number(digits);
    return Number.isFinite(n) ? n : 0;
  };

  const numericStats = Object.values(statsMap).map((s) => ({
    users: parseNumber(s.users),
    orders: parseNumber(s.orders),
    revenue: parseNumber(s.revenue),
  }));
  const maxUsers = Math.max(...numericStats.map((s) => s.users), 1);
  const maxOrders = Math.max(...numericStats.map((s) => s.orders), 1);
  const maxRevenue = Math.max(...numericStats.map((s) => s.revenue), 1);

  const computePct = (value: number, max: number) => {
    if (!max) return 0;
    return Math.min(100, Math.round((value / max) * 100));
  };

  // ============================================================
  // Tooltip renderer – all values are forced to strings
  // ============================================================
  const renderTooltip = ({ feature }: { feature?: Feature }) => {
    const key = feature ? getFeatureKey(feature) : null;
    const stats = key
      ? statsMap[key] || statsMap[String(key).toUpperCase()]
      : undefined;

    if (stats) {
      const usersNum = parseNumber(stats.users);
      const ordersNum = parseNumber(stats.orders);
      const revenueNum = parseNumber(stats.revenue);

      const usersPct = computePct(usersNum, maxUsers);
      const ordersPct = computePct(ordersNum, maxOrders);
      const revenuePct = computePct(revenueNum, maxRevenue);

      const accent = fillColor(feature) || "#1976d2";

      // Safely get display name – convert to string or fallback to key
      const displayName = (() => {
        const raw = feature?.properties?.name;
        return typeof raw === "string" && raw.trim() ? raw : key || "Unknown";
      })();

      // Safely get iso code
      const isoCode = (() => {
        const raw = feature?.properties?.iso_a3;
        return typeof raw === "string" ? raw : "";
      })();

      return (
        <div
          style={{
            background: "linear-gradient(180deg, #fff, #fbfbfb)",
            padding: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            fontSize: 14,
            minWidth: 380,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            color: "#222",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 26,
                lineHeight: 1,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 8,
                background: "rgba(0,0,0,0.03)",
              }}
            >
              {stats.flag}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{displayName}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                Sales region snapshot
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#666" }}>Status</div>
              <div
                style={{
                  marginTop: 6,
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: accent,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {accent === "#2e7d32"
                  ? "Top"
                  : accent === "#ed6c02"
                    ? "Mid"
                    : "Low"}
              </div>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ color: "#555" }}>Users</div>
                <div style={{ fontWeight: 700 }}>{stats.users}</div>
              </div>
              <div
                style={{
                  height: 10,
                  background: "#f1f3f4",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${usersPct}%`,
                    height: "100%",
                    background: accent,
                    borderRadius: 6,
                    transition: "width 260ms ease",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ color: "#555" }}>Orders</div>
                <div style={{ fontWeight: 700 }}>{stats.orders}</div>
              </div>
              <div
                style={{
                  height: 10,
                  background: "#f1f3f4",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${ordersPct}%`,
                    height: "100%",
                    background: "#4caf50",
                    borderRadius: 6,
                    transition: "width 260ms ease",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ color: "#555" }}>Revenue</div>
                <div style={{ fontWeight: 700 }}>{stats.revenue}</div>
              </div>
              <div
                style={{
                  height: 10,
                  background: "#f1f3f4",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${revenuePct}%`,
                    height: "100%",
                    background: "#ff9800",
                    borderRadius: 6,
                    transition: "width 260ms ease",
                  }}
                />
              </div>

              <div
                style={{
                  marginTop: 6,
                  padding: 10,
                  borderRadius: 8,
                  background: "rgba(0,0,0,0.03)",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ fontSize: 12, color: "#666" }}>
                  Avg order value
                </div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>
                  {ordersNum > 0
                    ? `$${Math.round(revenueNum / ordersNum).toLocaleString()}`
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>
              <strong style={{ color: accent }}>{isoCode}</strong> &nbsp;•&nbsp;
              Data snapshot
            </div>
            <div style={{ fontSize: 12, color: "#666" }}>Updated recently</div>
          </div>
        </div>
      );
    }

    // Fallback tooltip – ensure name is a string
    const name =
      (typeof feature?.properties?.name === "string" &&
        feature.properties.name) ||
      (typeof feature?.properties?.admin === "string" &&
        feature.properties.admin) ||
      (typeof feature?.id === "string" && feature.id) ||
      "Unknown";

    return (
      <div
        style={{
          background: "white",
          padding: 12,
          border: "1px solid #eee",
          borderRadius: 8,
          fontSize: 13,
          minWidth: 220,
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontWeight: 700 }}>{name}</div>
      </div>
    );
  };

  // ============================================================
  // Render the map
  // ============================================================
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <LegendItem color={colorMap.England} label="Low Selling" />
          <LegendItem color={colorMap.USA} label="Top Selling" />
          <LegendItem color={colorMap.Canada} label="Mid Selling" />
        </div>
        <div style={{ fontSize: 12, color: "#666" }}>
          <strong>Color meaning:</strong> Colors indicate status categories.
          Hover a country for details.
        </div>
      </div>

      <ResponsiveGeoMap
        features={world.features}
        projectionType="mercator"
        projectionScale={120}
        projectionTranslation={[0.5, 0.5]}
        borderWidth={0.5}
        borderColor="#333"
        fillColor={(f: Feature | undefined) => fillColor(f)}
        tooltip={renderTooltip}
      />
    </div>
  );
}
