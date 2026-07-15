"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import { T, useI18n } from "../../i18n";
import { publicAsset } from "../../site-path";

const descriptions = {
  zh: "你面向一片开阔的湖面。远处的桥从两岸向中央抬起，桥顶是一座深色屋顶的亭阁。树木沿湖岸展开，山的轮廓在薄雾中变浅。",
  en: "You are facing an open stretch of water. In the distance, a bridge rises toward a dark-roofed pavilion. Trees line the shore and the hills fade into a light mist.",
};

export default function VisualQuyuanPage() {
  const { locale } = useI18n();
  const [isReading, setIsReading] = useState(false);
  const sceneDescription = descriptions[locale];

  useEffect(() => {
    const shouldAutoplay = new URLSearchParams(window.location.search).get("autoplay") === "1";
    if (shouldAutoplay && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(sceneDescription);
      utterance.lang = locale === "zh" ? "zh-CN" : "en-US";
      utterance.rate = 0.88;
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }

    return () => window.speechSynthesis?.cancel();
  }, [locale, sceneDescription]);

  const toggleReading = () => {
    if (!("speechSynthesis" in window)) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sceneDescription);
    utterance.lang = locale === "zh" ? "zh-CN" : "en-US";
    utterance.rate = 0.88;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  return (
    <div className="page-shell detail-page visual-detail">
      <SiteHeader backHref="/visual" backLabel="西湖十景" backLabelEn="Ten scenes" />
      <main className="visual-detail-main">
        <div className="detail-photo" role="img" aria-label={locale === "zh" ? "西湖水面上的玉带桥与亭阁" : "A bridge and pavilion across West Lake"} style={{ backgroundImage: `url(${publicAsset("quyuan-lake.jpg")})` }} />
        <article className="description-panel">
          <h1><T zh="曲院风荷" en="Quyuan Garden" /></h1>
          <p>{sceneDescription}</p>
          <button type="button" className="read-button" onClick={toggleReading}>
            <span aria-hidden="true">{isReading ? "■" : "▶"}</span>
            {isReading ? <T zh="停止" en="Stop" /> : <T zh="朗读" en="Listen" />}
          </button>
        </article>
      </main>
    </div>
  );
}
