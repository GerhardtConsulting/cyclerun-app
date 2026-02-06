import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — CycleRun.app",
  description: "Impressum von CycleRun.app — Angaben gemäß § 5 TMG. Verantwortlich: Maximilian Gerhardt.",
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum — CycleRun.app",
    description: "Angaben gemäß § 5 TMG / § 18 MStV.",
    url: "https://cyclerun.app/impressum",
  },
};

export default function Impressum() {
  return (
    <div className="legal-page">
      <Link href="/" className="legal-back">← Zurück zu CycleRun</Link>

      <h1>Impressum</h1>
      <p className="legal-date">Angaben gemäß § 5 TMG / § 18 MStV</p>

      <h2>Verantwortlich</h2>
      <p>
        Maximilian Gerhardt<br />
        cyclerun.app — Privates Softwareprojekt
      </p>

      <div style={{ background: 'rgba(249, 115, 22, 0.06)', border: '1px solid rgba(249, 115, 22, 0.12)', borderRadius: '12px', padding: '1.25rem', margin: '1.5rem 0' }}>
        <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Hinweis zur Anschrift
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          CycleRun.app befindet sich derzeit in der Vorbereitungsphase und ist noch nicht öffentlich gelauncht. Die vollständige ladungsfähige Anschrift wird in den kommenden Tagen hier ergänzt. Bis dahin ist die Anschrift auf private Anfrage per E-Mail unverzüglich verfügbar. Dieses Vorgehen entspricht der gängigen Praxis bei privaten Softwareprojekten in der Entwicklungsphase (vgl. § 5 TMG, Privatpersonen ohne geschäftsmäßiges Angebot).
        </p>
      </div>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href="mailto:kontakt@cyclerun.app">kontakt@cyclerun.app</a><br />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Antwortzeit in der Regel innerhalb von 24 Stunden.</span>
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
      <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.</p>

      <h2>Haftung für Links</h2>
      <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>

      <h2>Urheberrecht</h2>
      <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>

      <h2>Streitschlichtung</h2>
      <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr/</a></p>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>

      <h2>Transparenzerklärung</h2>
      <p>CycleRun.app ist ein nicht-kommerzielles Community-Projekt. Es wird ohne Gewinnabsicht betrieben und dient als Technologie-Showcase für kamerabasierte Bewegungserkennung im Fitnessbereich.</p>
      <ul>
        <li>Es gibt keine zahlenden Kunden oder Investoren.</li>
        <li>Es werden keine Nutzerdaten verkauft oder an Werbetreibende weitergegeben.</li>
        <li>Die Erhebung von Daten (E-Mail, Name) dient ausschließlich der Verbesserung des Produkts und der Entwicklung neuer Features.</li>
        <li>Alle verwendeten Technologien sind frei verfügbar.</li>
      </ul>
    </div>
  );
}
