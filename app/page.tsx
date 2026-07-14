import Link from "next/link";
import SiteHeader from "./components/SiteHeader";

export default function Home() {
  return (
    <div className="page-shell home-page">
      <SiteHeader />
      <main className="entry-main">
        <h1>选择导览</h1>
        <nav className="entry-grid" aria-label="选择导览类型">
          <Link className="entry-card visual-entry" href="/visual">
            <span aria-hidden="true">01</span>
            <strong>视障导览</strong>
            <b aria-hidden="true">→</b>
          </Link>
          <Link className="entry-card hearing-entry" href="/hearing">
            <span aria-hidden="true">02</span>
            <strong>听障导览</strong>
            <b aria-hidden="true">→</b>
          </Link>
        </nav>
      </main>
    </div>
  );
}
