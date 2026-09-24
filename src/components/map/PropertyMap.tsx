"use client";
import { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";

export type MapPoint = {
  slug: string;
  title: string;
  area: string;
  price: number;
  lng: number;
  lat: number;
};

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

function esc(v: string) {
  return v.replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]!));
}

function circleFeature(lng: number, lat: number, radiusM = 55, steps = 56) {
  const dLat = radiusM / 111320;
  const dLng = radiusM / (111320 * Math.cos((lat * Math.PI) / 180));
  const coords: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * 2 * Math.PI;
    coords.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)]);
  }
  return { type: "Feature" as const, geometry: { type: "Polygon" as const, coordinates: [coords] }, properties: {} };
}

const NORMAL_BUILDING_COLOR = ["interpolate", ["linear"], ["get", "height"], 0, "#2a2620", 60, "#4b3f2a", 180, "#6b5527"];

export function PropertyMap({
  points,
  selectedSlug,
  zoom = 13,
  pitch = 55,
  bearing = -20,
  className = "min-h-[520px]",
}: {
  points: MapPoint[];
  selectedSlug?: string;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !ref.current || points.length === 0) return;
    let map: import("mapbox-gl").Map | undefined;
    let disposed = false;
    let selectedFeatureId: number | string | null = null;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (disposed || !ref.current) return;
      mapboxgl.accessToken = token;

      const first = points.find((p) => p.slug === selectedSlug) ?? points[0];
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [first.lng, first.lat],
        zoom,
        pitch,
        bearing,
        antialias: true,
      });
      const m = map;

      m.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }), "top-right");

      function highlightBuilding(p: MapPoint) {
        if (!m.getLayer("foxy-3d-buildings")) return;
        if (selectedFeatureId != null) m.setFeatureState({ source: "composite", sourceLayer: "building", id: selectedFeatureId }, { selected: false });
        const pt = m.project([p.lng, p.lat]);
        const pad = 16;
        const feats = m.queryRenderedFeatures(
          [[pt.x - pad, pt.y - pad], [pt.x + pad, pt.y + pad]],
          { layers: ["foxy-3d-buildings"] }
        );
        const f = feats[0] as (typeof feats[0] & { id?: number | string }) | undefined;
        if (f && f.id != null) {
          selectedFeatureId = f.id;
          m.setFeatureState({ source: "composite", sourceLayer: "building", id: f.id }, { selected: true });
        }
      }

      function selectPoint(p: MapPoint) {
        const src = m.getSource("foxy-glow") as import("mapbox-gl").GeoJSONSource | undefined;
        src?.setData({ type: "FeatureCollection", features: [circleFeature(p.lng, p.lat)] });
        m.flyTo({ center: [p.lng, p.lat], zoom: 16.2, pitch: 62, bearing: -28, duration: 2200, essential: true });
        m.once("idle", () => highlightBuilding(p));
      }

      m.on("style.load", () => {
        if (disposed) return;

        // Gold spotlight glow on the ground for the selected property
        if (!m.getSource("foxy-glow")) {
          m.addSource("foxy-glow", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          m.addLayer({ id: "foxy-glow-fill", type: "fill", source: "foxy-glow", paint: { "fill-color": "#D4AF37", "fill-opacity": 0.22 } });
          m.addLayer({ id: "foxy-glow-line", type: "line", source: "foxy-glow", paint: { "line-color": "#F0D67A", "line-width": 2, "line-opacity": 0.8 } });
        }

        // 3D buildings — selected building rendered gold via feature-state
        if (!m.getLayer("foxy-3d-buildings")) {
          const labelId = m.getStyle().layers?.find((l) => l.type === "symbol" && (l.layout as Record<string, unknown> | undefined)?.["text-field"])?.id;
          m.addLayer(
            {
              id: "foxy-3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 14,
              paint: {
                "fill-extrusion-color": ["case", ["boolean", ["feature-state", "selected"], false], "#E9C65A", NORMAL_BUILDING_COLOR] as unknown as string,
                "fill-extrusion-opacity": 0.9,
                "fill-extrusion-height": ["interpolate", ["linear"], ["zoom"], 14, 0, 14.5, ["get", "height"]],
                "fill-extrusion-base": ["interpolate", ["linear"], ["zoom"], 14, 0, 14.5, ["get", "min_height"]],
              },
            },
            labelId
          );
        }

        // Markers + popups
        for (const p of points) {
          const popup = new mapboxgl.Popup({ offset: 26 }).setHTML(
            `<div class="foxy-popup-title">${esc(p.title)}</div>` +
              `<div class="foxy-popup-price">${esc(p.area)} · ${esc(gbp.format(p.price))}</div>` +
              `<a class="foxy-popup-link" href="/properties/${esc(p.slug)}">VIEW PROPERTY →</a>`
          );
          const marker = new mapboxgl.Marker({ color: "#D4AF37" }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(m);
          marker.getElement().style.cursor = "pointer";
          marker.getElement().addEventListener("click", () => selectPoint(p));
        }

        if (points.length > 1 && !selectedSlug) {
          const b = new mapboxgl.LngLatBounds();
          points.forEach((p) => b.extend([p.lng, p.lat]));
          m.fitBounds(b, { padding: 90, maxZoom: 14, pitch, bearing, duration: 0 });
        }

        // Auto fly-to + highlight the selected property (e.g. property detail page)
        const sel = points.find((p) => p.slug === selectedSlug) ?? (points.length === 1 ? points[0] : null);
        if (sel) m.once("idle", () => selectPoint(sel));
      });
    })();

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [token, points, selectedSlug, zoom, pitch, bearing]);

  if (!token) {
    return (
      <div className={`grid ${className} place-items-center border border-white/10 bg-[#141413] p-8 text-center text-[#A7A29A]`} data-testid="map-fallback">
        Interactive 3D map activates when NEXT_PUBLIC_MAPBOX_TOKEN is configured.
      </div>
    );
  }

  return <div ref={ref} data-testid="property-map" className={`w-full overflow-hidden rounded-sm ${className}`} aria-label="Interactive 3D property map" />;
}
