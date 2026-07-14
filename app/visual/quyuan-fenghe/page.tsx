"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../../components/SiteHeader";

const sceneDescription =
  "你面向一片开阔的湖面。远处的桥从两岸向中央抬起，桥顶是一座深色屋顶的亭阁。树木沿湖岸展开，山的轮廓在薄雾中变浅。";

export default function VisualQuyuanPage() {
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const toggleReading = () => {
    if (!("speechSynthesis" in window)) return;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(sceneDescription);
    utterance.lang = "zh-CN";
    utterance.rate = 0.88;
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsReading(true);
  };

  return (
    <div className="page-shell detail-page visual-detail">
      <SiteHeader backHref="/visual" backLabel="西湖十景" />
      <main className="visual-detail-main">
        <div className="detail-photo" role="img" aria-label="西湖水面上的玉带桥与亭阁" />
        <article className="description-panel">
          <h1>曲院风荷</h1>
          <p>{sceneDescription}</p>
          <button type="button" className="read-button" onClick={toggleReading}>
            <span aria-hidden="true">{isReading ? "■" : "▶"}</span>
            {isReading ? "停止" : "朗读"}
          </button>
        </article>
      </main>
    </div>
  );
}
