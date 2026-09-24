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

export function PropertyMap({
  points,
  zoom = 13,
  pitch = 55,
  bearing = -20,
  className = "min-h-[520px]",
}: {
  points: MapPoint[];
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

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (disposed || !ref.current) return;
      mapboxgl.accessToken = token;

      const first = points[0];
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [first.lng, first.lat],
        zoom,
        pitch,
        bearing,
        antialias: true,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: true, visualizePitch: true }), "top-right");

      map.on("style.load", () => {
        if (disposed || !map) return;
        // 3D buildings
        if (!map.getLayer("foxy-3d-buildings")) {
          const labelId = map.getStyle().layers?.find((l) => l.type === "symbol" && (l.layout as Record<string, unknown> | undefined)?.["text-field"])?.id;
          map.addLayer(
            {
              id: "foxy-3d-buildings",
              source: "composite",
              "source-layer": "building",
              filter: ["==", "extrude", "true"],
              type: "fill-extrusion",
              minzoom: 14,
              paint: {
                "fill-extrusion-color": ["interpolate", ["linear"], ["get", "height"], 0, "#2a2620", 60, "#4b3f2a", 180, "#6b5527"],
                "fill-extrusion-opacity": 0.85,
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
          new mapboxgl.Marker({ color: "#D4AF37" }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map!);
        }

        // Fit bounds when multiple points
        if (points.length > 1) {
          const b = new mapboxgl.LngLatBounds();
          points.forEach((p) => b.extend([p.lng, p.lat]));
          map!.fitBounds(b, { padding: 90, maxZoom: 14, pitch, bearing, duration: 0 });
        }
      });
    })();

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [token, points, zoom, pitch, bearing]);

  if (!token) {
    return (
      <div className={`grid ${className} place-items-center border border-white/10 bg-[#141413] p-8 text-center text-[#A7A29A]`} data-testid="map-fallback">
        Interactive 3D map activates when NEXT_PUBLIC_MAPBOX_TOKEN is configured.
      </div>
    );
  }

  return <div ref={ref} data-testid="property-map" className={`w-full overflow-hidden rounded-sm ${className}`} aria-label="Interactive 3D property map" />;
}
