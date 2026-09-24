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
const EMPTY = { type: "FeatureCollection" as const, features: [] };

function styleMarker(el: HTMLElement, active: boolean) {
  const svg = el.querySelector("svg") as SVGElement | null;
  if (svg) {
    svg.style.transition = "transform .25s ease, filter .25s ease";
    svg.style.transformOrigin = "bottom center";
    svg.style.transform = active ? "scale(1.7)" : "scale(1)";
    svg.style.filter = active ? "drop-shadow(0 0 9px rgba(212,175,55,.95))" : "none";
  }
  el.style.zIndex = active ? "6" : "1";
}

export function PropertyMap({
  points,
  selectedSlug,
  activeSlug,
  resizeKey,
  heatPoints,
  heatVisible = false,
  zoom = 13,
  pitch = 55,
  bearing = -20,
  className = "min-h-[520px]",
}: {
  points: MapPoint[];
  selectedSlug?: string;
  activeSlug?: string | null;
  resizeKey?: string | number;
  heatPoints?: { lng: number; lat: number; weight: number }[];
  heatVisible?: boolean;
  zoom?: number;
  pitch?: number;
  bearing?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<{ setActive: (s: string | null) => void; resize: () => void; setHeat: (v: boolean) => void; setHeatData: (pts: { lng: number; lat: number; weight: number }[]) => void } | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!token || !ref.current || points.length === 0) return;
    let map: import("mapbox-gl").Map | undefined;
    let disposed = false;
    let selectedFeatureId: number | string | null = null;
    const markers: Record<string, import("mapbox-gl").Marker> = {};

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (disposed || !ref.current) return;
      mapboxgl.accessToken = token;

      const first = points.find((p) => p.slug === selectedSlug) ?? points[0];
      map = new mapboxgl.Map({ container: ref.current, style: "mapbox://styles/mapbox/dark-v11", center: [first.lng, first.lat], zoom, pitch, bearing, antialias: true });
      const m = map;
      m.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }), "top-right");

      const setGlow = (p: MapPoint | null) => {
        const src = m.getSource("foxy-glow") as import("mapbox-gl").GeoJSONSource | undefined;
        src?.setData(p ? { type: "FeatureCollection", features: [circleFeature(p.lng, p.lat)] } : EMPTY);
      };

      const highlightBuilding = (p: MapPoint) => {
        if (!m.getLayer("foxy-3d-buildings")) return;
        if (selectedFeatureId != null) m.setFeatureState({ source: "composite", sourceLayer: "building", id: selectedFeatureId }, { selected: false });
        const pt = m.project([p.lng, p.lat]);
        const pad = 16;
        const feats = m.queryRenderedFeatures([[pt.x - pad, pt.y - pad], [pt.x + pad, pt.y + pad]], { layers: ["foxy-3d-buildings"] });
        const f = feats[0] as (typeof feats[0] & { id?: number | string }) | undefined;
        if (f && f.id != null) {
          selectedFeatureId = f.id;
          m.setFeatureState({ source: "composite", sourceLayer: "building", id: f.id }, { selected: true });
        }
      };

      const selectPoint = (p: MapPoint) => {
        setGlow(p);
        m.flyTo({ center: [p.lng, p.lat], zoom: 16.2, pitch: 62, bearing: -28, duration: 2200, essential: true });
        m.once("idle", () => highlightBuilding(p));
      };

      // Hover highlight (no camera move): glow ring + enlarge the marker.
      const setActive = (slug: string | null) => {
        const p = slug ? points.find((x) => x.slug === slug) : null;
        for (const [s, mk] of Object.entries(markers)) styleMarker(mk.getElement(), s === slug);
        setGlow(p ?? null);
      };
      controllerRef.current = {
        setActive,
        resize: () => m.resize(),
        setHeat: (v: boolean) => { if (m.getLayer("foxy-heat")) m.setLayoutProperty("foxy-heat", "visibility", v ? "visible" : "none"); },
        setHeatData: (pts) => {
          const src = m.getSource("foxy-heat") as import("mapbox-gl").GeoJSONSource | undefined;
          src?.setData({ type: "FeatureCollection", features: pts.map((p) => ({ type: "Feature", geometry: { type: "Point", coordinates: [p.lng, p.lat] }, properties: { weight: p.weight } })) });
        },
      };

      m.on("style.load", () => {
        if (disposed) return;
        if (!m.getSource("foxy-glow")) {
          m.addSource("foxy-glow", { type: "geojson", data: EMPTY });
          m.addLayer({ id: "foxy-glow-fill", type: "fill", source: "foxy-glow", paint: { "fill-color": "#D4AF37", "fill-opacity": 0.22 } });
          m.addLayer({ id: "foxy-glow-line", type: "line", source: "foxy-glow", paint: { "line-color": "#F0D67A", "line-width": 2, "line-opacity": 0.85 } });
        }
        // Price/density heat layer (illustrative — driven by connected data)
        if (!m.getSource("foxy-heat")) {
          m.addSource("foxy-heat", { type: "geojson", data: EMPTY });
          m.addLayer({
            id: "foxy-heat",
            type: "heatmap",
            source: "foxy-heat",
            maxzoom: 16,
            layout: { visibility: heatVisible ? "visible" : "none" },
            paint: {
              "heatmap-weight": ["interpolate", ["linear"], ["get", "weight"], 0, 0, 3, 1],
              "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 10, 1, 16, 3],
              "heatmap-color": ["interpolate", ["linear"], ["heatmap-density"],
                0, "rgba(11,11,10,0)", 0.2, "rgba(107,85,39,0.5)", 0.45, "rgba(184,149,62,0.75)", 0.7, "#D4AF37", 1, "#F5E7B0"],
              "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 30, 16, 90],
              "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 14, 0.9, 16, 0.35],
            },
          });
          if (heatPoints && heatPoints.length) controllerRef.current?.setHeatData(heatPoints);
        }
        if (!m.getLayer("foxy-3d-buildings")) {
          const labelId = m.getStyle().layers?.find((l) => l.type === "symbol" && (l.layout as Record<string, unknown> | undefined)?.["text-field"])?.id;
          m.addLayer(
            {
              id: "foxy-3d-buildings", source: "composite", "source-layer": "building", filter: ["==", "extrude", "true"], type: "fill-extrusion", minzoom: 14,
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

        for (const p of points) {
          const popup = new mapboxgl.Popup({ offset: 26 }).setHTML(
            `<div class="foxy-popup-title">${esc(p.title)}</div>` +
              `<div class="foxy-popup-price">${esc(p.area)} · ${esc(gbp.format(p.price))}</div>` +
              `<a class="foxy-popup-link" href="/properties/${esc(p.slug)}">VIEW PROPERTY →</a>`
          );
          const marker = new mapboxgl.Marker({ color: "#D4AF37" }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(m);
          marker.getElement().style.cursor = "pointer";
          marker.getElement().addEventListener("click", () => selectPoint(p));
          markers[p.slug] = marker;
        }

        if (points.length > 1 && !selectedSlug) {
          const b = new mapboxgl.LngLatBounds();
          points.forEach((p) => b.extend([p.lng, p.lat]));
          m.fitBounds(b, { padding: 90, maxZoom: 14, pitch, bearing, duration: 0 });
        }

        const sel = points.find((p) => p.slug === selectedSlug) ?? (points.length === 1 ? points[0] : null);
        if (sel) m.once("idle", () => selectPoint(sel));
      });
    })();

    return () => {
      disposed = true;
      controllerRef.current = null;
      map?.remove();
    };
  }, [token, points, selectedSlug, zoom, pitch, bearing]);

  useEffect(() => {
    controllerRef.current?.setActive(activeSlug ?? null);
  }, [activeSlug]);

  useEffect(() => {
    if (resizeKey === undefined) return;
    const t = setTimeout(() => controllerRef.current?.resize(), 80);
    return () => clearTimeout(t);
  }, [resizeKey]);

  useEffect(() => {
    if (heatPoints) controllerRef.current?.setHeatData(heatPoints);
  }, [heatPoints]);

  useEffect(() => {
    controllerRef.current?.setHeat(heatVisible);
  }, [heatVisible]);

  if (!token) {
    return (
      <div className={`grid ${className} place-items-center border border-white/10 bg-[#141413] p-8 text-center text-[#A7A29A]`} data-testid="map-fallback">
        Interactive 3D map activates when NEXT_PUBLIC_MAPBOX_TOKEN is configured.
      </div>
    );
  }

  return <div ref={ref} data-testid="property-map" className={`w-full overflow-hidden rounded-sm ${className}`} aria-label="Interactive 3D property map" />;
}
