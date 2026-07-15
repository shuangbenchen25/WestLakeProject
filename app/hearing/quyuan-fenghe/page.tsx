import SiteHeader from "../../components/SiteHeader";
import { T } from "../../i18n";

export default function HearingQuyuanPage() {
  return (
    <div className="page-shell detail-page hearing-detail">
      <SiteHeader backHref="/hearing" backLabel="西湖十景" backLabelEn="Ten scenes" />
      <main className="hearing-detail-main">
        <h1><T zh="曲院风荷" en="Quyuan Garden" /></h1>
        <div className="large-video-placeholder" aria-label="Captioned guide video coming soon">
          <span aria-hidden="true">CC</span>
          <strong><T zh="视频制作中" en="Video coming soon" /></strong>
          <div className="fake-controls" aria-hidden="true">
            <b>▶</b>
            <i />
            <b>□</b>
          </div>
        </div>
      </main>
    </div>
  );
}
