"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  distanceInMeters,
  scenicSpotZones,
  type GuideMode,
} from "../data/scenic-spots";
import { useI18n } from "../i18n";

type AMapPosition = {
  lng?: number;
  lat?: number;
  getLng?: () => number;
  getLat?: () => number;
};

type AMapGeolocationResult = {
  accuracy?: number;
  message?: string;
  position?: AMapPosition;
};

type AMapGeolocation = {
  getCurrentPosition: (
    callback: (status: string, result: AMapGeolocationResult) => void,
  ) => void;
};

type AMapNamespace = {
  Geolocation: new (options: {
    enableHighAccuracy: boolean;
    timeout: number;
  }) => AMapGeolocation;
};

declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode: string };
  }
}

const LOCATION_INTERVAL_MS = 12_000;
const MAX_ACCEPTED_ACCURACY_METERS = 100;

function readCoordinate(position?: AMapPosition) {
  if (!position) return null;
  const longitude = position.getLng?.() ?? position.lng;
  const latitude = position.getLat?.() ?? position.lat;

  if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) return null;
  return [longitude as number, latitude as number] as const;
}

export default function LocationGuide({ mode }: { mode: GuideMode }) {
  const { locale } = useI18n();
  const router = useRouter();
  const geolocationRef = useRef<AMapGeolocation | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triggeredRef = useRef(false);
  const [state, setState] = useState<"idle" | "loading" | "running" | "error">(
    "idle",
  );
  const [message, setMessage] = useState({ zh: "点击后允许定位，到达景点时自动打开介绍。", en: "Allow location to open a guide when you arrive." });

  const clearTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    geolocationRef.current = null;
  };

  const stop = () => {
    clearTracking();
    triggeredRef.current = false;
    setState("idle");
    setMessage({ zh: "定位导览已停止。", en: "Location guide stopped." });
  };

  const fail = (zh: string, en: string) => {
    clearTracking();
    setState("error");
    setMessage({ zh, en });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const checkPosition = () => {
    geolocationRef.current?.getCurrentPosition((status, result) => {
      if (status !== "complete") {
        fail("无法取得位置，请检查定位权限后重试。", "Location unavailable. Check permission and try again.");
        return;
      }

      const coordinate = readCoordinate(result.position);
      if (!coordinate) {
        fail("定位结果无效，请稍后重试。", "The location result is invalid. Please try again.");
        return;
      }

      const accuracy = result.accuracy ?? Number.POSITIVE_INFINITY;
      if (accuracy > MAX_ACCEPTED_ACCURACY_METERS) {
        setState("running");
        setMessage({ zh: "定位信号较弱，正在继续确认位置。", en: "Location signal is weak. Checking again." });
        return;
      }

      const nearest = scenicSpotZones
        .map((spot) => ({ spot, distance: distanceInMeters(coordinate, spot.coordinate) }))
        .sort((first, second) => first.distance - second.distance)[0];

      if (!nearest) return;
      if (nearest.distance <= nearest.spot.triggerRadiusMeters && !triggeredRef.current) {
        triggeredRef.current = true;
        setMessage({ zh: `已到达${nearest.spot.name}，正在打开导览。`, en: `You have reached ${nearest.spot.nameEn}. Opening the guide.` });
        router.push(`${nearest.spot.routes[mode]}?autoplay=1`);
        return;
      }

      setState("running");
      setMessage({ zh: `定位已开启，距${nearest.spot.name}约${Math.round(nearest.distance)}米。`, en: `Location is on. ${nearest.spot.nameEn} is about ${Math.round(nearest.distance)} metres away.` });
    });
  };

  const start = async () => {
    const legacyEnvironment = (import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    }).env;
    const key = (
      process.env.NEXT_PUBLIC_AMAP_KEY ?? legacyEnvironment?.VITE_AMAP_KEY
    )?.trim();
    if (!key) {
      setState("error");
      setMessage({ zh: "尚未配置高德定位服务，请联系网站维护人员。", en: "The location service is not configured." });
      return;
    }

    setState("loading");
    setMessage({ zh: "正在请求定位权限…", en: "Requesting location permission…" });

    try {
      const securityCode = process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE?.trim();
      if (securityCode) window._AMapSecurityConfig = { securityJsCode: securityCode };

      const { load } = await import("@amap/amap-jsapi-loader");
      const AMap = (await load({
        key,
        version: "2.0",
        plugins: ["AMap.Geolocation"],
      })) as AMapNamespace;

      geolocationRef.current = new AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10_000,
      });
      setState("running");
      checkPosition();
      intervalRef.current = setInterval(checkPosition, LOCATION_INTERVAL_MS);
    } catch {
      fail("高德定位服务加载失败，请检查网络后重试。", "The AMap location service failed to load. Check your connection.");
    }
  };

  const running = state === "running";

  return (
    <section className="location-guide" aria-labelledby={`location-guide-${mode}`}>
      <div>
        <h2 id={`location-guide-${mode}`}>{locale === "zh" ? "到点自动导览" : "Guide on arrival"}</h2>
        <p role="status" aria-live="polite">
          {message[locale]}
        </p>
      </div>
      {running ? (
        <button type="button" className="location-stop" onClick={stop}>
          {locale === "zh" ? "停止定位" : "Stop location"}
        </button>
      ) : (
        <button
          type="button"
          className="location-start"
          onClick={start}
          disabled={state === "loading"}
        >
          {state === "loading" ? (locale === "zh" ? "正在定位…" : "Locating…") : (locale === "zh" ? "开始定位导览" : "Start location guide")}
        </button>
      )}
    </section>
  );
}
