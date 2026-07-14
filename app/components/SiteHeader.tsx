import Link from "next/link";

type SiteHeaderProps = {
  backHref?: string;
  backLabel?: string;
};

export default function SiteHeader({ backHref, backLabel = "返回" }: SiteHeaderProps) {
  return (
    <header className="minimal-header">
      <Link className="minimal-brand" href="/" aria-label="西湖无障碍导览首页">
        <span aria-hidden="true">荷</span>
        <strong>西湖无障碍导览</strong>
      </Link>
      {backHref ? (
        <Link className="back-link" href={backHref}>
          <span aria-hidden="true">←</span> {backLabel}
        </Link>
      ) : null}
    </header>
  );
}
