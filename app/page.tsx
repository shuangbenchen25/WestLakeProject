import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import { T } from "./i18n";

export default function Home() {
  return (
    <div className="page-shell home-page">
      <SiteHeader />
      <main className="entry-main">
        <h1><T zh="选择导览" en="Choose a guide" /></h1>
        <nav className="entry-grid" aria-label="Guide modes">
          <Link className="entry-card visual-entry" href="/visual">
            <span aria-hidden="true">01</span>
            <strong><T zh="视障导览" en="Audio guide" /></strong>
            <b aria-hidden="true">→</b>
          </Link>
          <Link className="entry-card hearing-entry" href="/hearing">
            <span aria-hidden="true">02</span>
            <strong><T zh="听障导览" en="Visual guide" /></strong>
            <b aria-hidden="true">→</b>
          </Link>
        </nav>
      </main>
    </div>
  );
}
