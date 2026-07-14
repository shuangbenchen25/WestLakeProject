import Link from "next/link";
import SiteHeader from "./SiteHeader";

const scenes = [
  "曲院风荷",
  "苏堤春晓",
  "平湖秋月",
  "断桥残雪",
  "柳浪闻莺",
  "花港观鱼",
  "双峰插云",
  "三潭印月",
  "雷峰夕照",
  "南屏晚钟",
];

type SceneGridProps = {
  mode: "visual" | "hearing";
};

export default function SceneGrid({ mode }: SceneGridProps) {
  const modeName = mode === "visual" ? "视障导览" : "听障导览";

  return (
    <div className={`page-shell scene-page ${mode}`}>
      <SiteHeader backHref="/" backLabel="重新选择" />
      <main className="scene-main">
        <h1>{modeName} · 西湖十景</h1>
        <ol className="ten-scenes">
          {scenes.map((scene, index) => {
            const number = String(index + 1).padStart(2, "0");
            if (index === 0) {
              return (
                <li key={scene}>
                  <Link
                    className="scene-card active-scene"
                    href={`/${mode}/quyuan-fenghe`}
                  >
                    <span>{number}</span>
                    <strong>{scene}</strong>
                    <b aria-hidden="true">→</b>
                  </Link>
                </li>
              );
            }

            return (
              <li key={scene}>
                <div className="scene-card reserved-scene" aria-label={`${scene}，尚未开放`}>
                  <span>{number}</span>
                  <strong>{scene}</strong>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
