import Link from "next/link";

export default function SubpageFooter() {
  return (
    <footer className="subpage-footer">
      <div className="subpage-footer-inner">
        <div className="subpage-footer-top">
          <div className="subpage-footer-brand">
            <Link href="/" className="subpage-footer-logo">
              cyclerun<span className="header-logo-app">.app</span>
            </Link>
            <p className="subpage-footer-tagline">Free indoor cycling with your webcam. No smart trainer, no subscription.</p>
          </div>

          <div className="subpage-footer-grid">
            <div className="subpage-footer-col">
              <strong>Product</strong>
              <Link href="/">Start Riding</Link>
              <Link href="/routes">Routes</Link>
              <Link href="/creator">Creator Program</Link>
              <Link href="/roadmap">Roadmap</Link>
            </div>
            <div className="subpage-footer-col">
              <strong>Guides</strong>
              <Link href="/guide/zwift-alternative-free">Free Zwift Alternative</Link>
              <Link href="/guide/rouvy-alternative">Rouvy Alternative</Link>
              <Link href="/guide/indoor-cycling-app">Indoor Cycling App</Link>
              <Link href="/guide/heimtrainer-app">Heimtrainer App</Link>
              <Link href="/guide">All Guides</Link>
            </div>
            <div className="subpage-footer-col">
              <strong>Resources</strong>
              <Link href="/blog">Blog</Link>
              <Link href="/guide/virtual-cycling-videos">Virtual Cycling Videos</Link>
              <Link href="/guide/ergometer-training">Ergometer Training</Link>
              <Link href="/guide/spinning-bike-app">Spinning Bike App</Link>
            </div>
            <div className="subpage-footer-col">
              <strong>Company</strong>
              <Link href="/datenschutz">Privacy Policy</Link>
              <Link href="/impressum">Legal Notice</Link>
            </div>
          </div>
        </div>

        <div className="subpage-footer-cta">
          <p>Ready to ride? <Link href="/" className="subpage-footer-cta-link">Open CycleRun free →</Link></p>
          <span className="subpage-footer-divider">·</span>
          <p>Film routes &amp; earn? <Link href="/creator" className="subpage-footer-cta-link">Join the Creator Program →</Link></p>
        </div>

        <div className="subpage-footer-bottom">
          <span>© 2026 CycleRun.app — Community project, non-profit</span>
        </div>
      </div>
    </footer>
  );
}
