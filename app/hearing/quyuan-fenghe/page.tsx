import SiteHeader from "../../components/SiteHeader";

export default function HearingQuyuanPage() {
  return (
    <div className="page-shell detail-page hearing-detail">
      <SiteHeader backHref="/hearing" backLabel="西湖十景" />
      <main className="hearing-detail-main">
        <h1>曲院风荷</h1>
        <div className="large-video-placeholder" aria-label="曲院风荷视频制作中">
          <span aria-hidden="true">CC</span>
          <strong>视频制作中</strong>
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
