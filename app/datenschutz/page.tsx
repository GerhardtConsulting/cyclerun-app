import Link from "next/link";
import type { Metadata } from "next";
import SubpageNav from "@/components/SubpageNav";
import SubpageFooter from "@/components/SubpageFooter";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von CycleRun.app — Wie wir mit deinen Daten umgehen. Informationen zu Cookies, Webcam-Datenverarbeitung und deinen Rechten.",
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    title: "Datenschutzerklärung",
    description: "Wie CycleRun.app mit deinen Daten umgeht. 100% lokal, keine Tracking-Cookies.",
    url: "https://cyclerun.app/datenschutz",
  },
};

export default function Datenschutz() {
  return (
    <>
    <SubpageNav />
    <div className="legal-page">

      <h1>Datenschutzerklärung</h1>
      <p className="legal-date">Stand: Februar 2026</p>

      <h2>1. Verantwortlicher</h2>
      <p>
        CycleRun.app ist ein Community-Projekt ohne Gewinnabsicht.<br />
        Kontakt: datenschutz@cyclerun.app
      </p>

      <h2>2. Überblick</h2>
      <p>CycleRun.app nimmt den Schutz deiner persönlichen Daten sehr ernst. Wir behandeln deine personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften (DSGVO, BDSG, TTDSG) sowie dieser Datenschutzerklärung.</p>

      <h2>3. Welche Daten wir erheben</h2>

      <h3>3.1 Registrierungsdaten</h3>
      <p>Bei der Registrierung erheben wir:</p>
      <table>
        <thead>
          <tr><th>Datum</th><th>Zweck</th><th>Rechtsgrundlage</th></tr>
        </thead>
        <tbody>
          <tr><td>Vorname</td><td>Personalisierung der Nutzererfahrung</td><td>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</td></tr>
          <tr><td>Nachname (optional)</td><td>Personalisierung</td><td>Art. 6 Abs. 1 lit. a DSGVO</td></tr>
          <tr><td>E-Mail-Adresse</td><td>Account-Identifikation, Produkt-Updates</td><td>Art. 6 Abs. 1 lit. a DSGVO</td></tr>
          <tr><td>Bevorzugte Sportart</td><td>Produktverbesserung</td><td>Art. 6 Abs. 1 lit. a DSGVO</td></tr>
          <tr><td>Spracheinstellung</td><td>Lokalisierung</td><td>Art. 6 Abs. 1 lit. f DSGVO</td></tr>
        </tbody>
      </table>

      <h3>3.2 Webcam-Daten</h3>
      <p><strong>Wichtig: CycleRun speichert, überträgt oder verarbeitet KEINE Webcam-Bilder oder -Videos.</strong></p>
      <p>Die Webcam wird ausschließlich lokal in deinem Browser verwendet, um Bewegungen zu erkennen. Die Bildverarbeitung findet vollständig auf deinem Gerät statt (Client-Side). Es werden zu keinem Zeitpunkt Bild- oder Videodaten an unsere Server übertragen.</p>

      <h3>3.3 Trainingsdaten (Zukunft)</h3>
      <p>In zukünftigen Versionen können optional Trainingsdaten (Dauer, Distanz, Geschwindigkeit, RPM) gespeichert werden, um dir eine Trainingshistorie zu ermöglichen. Dies erfolgt nur mit deiner ausdrücklichen Einwilligung.</p>

      <h3>3.4 Technische Daten</h3>
      <p>Beim Besuch unserer Website werden automatisch erhoben:</p>
      <ul>
        <li>IP-Adresse (anonymisiert)</li>
        <li>Browser-Typ und -Version</li>
        <li>Betriebssystem</li>
        <li>Zugriffszeitpunkt</li>
      </ul>
      <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der technischen Bereitstellung).</p>

      <h2>4. Zweck der Datenverarbeitung</h2>
      <p>Wir verarbeiten deine Daten ausschließlich zu folgenden Zwecken:</p>
      <ul>
        <li><strong>Produktverbesserung:</strong> Nutzerdaten helfen uns, das perfekte Produkt und weitere Features zu entwickeln.</li>
        <li><strong>Personalisierung:</strong> Anpassung der Nutzererfahrung an deine Präferenzen.</li>
        <li><strong>Kommunikation:</strong> Informationen über neue Features und Updates (nur mit Einwilligung).</li>
      </ul>
      <p><strong>CycleRun ist ein Community-Projekt ohne Gewinnabsicht.</strong> Es findet kein Verkauf von Daten an Dritte statt.</p>

      <h2>5. Datenspeicherung &amp; Hosting</h2>
      <p>Unsere Daten werden bei folgenden Anbietern gehostet:</p>
      <ul>
        <li><strong>Supabase Inc.</strong> (Datenbank) — Server in Frankfurt/Main (eu-central-1), DSGVO-konform</li>
        <li><strong>Vercel Inc.</strong> (Website-Hosting) — Edge Network mit europäischen Nodes</li>
      </ul>
      <p>Beide Anbieter haben Standardvertragsklauseln (SCCs) gemäß Art. 46 DSGVO implementiert.</p>

      <h2>6. Deine Rechte (Art. 15–21 DSGVO)</h2>
      <p>Du hast jederzeit das Recht auf:</p>
      <ul>
        <li><strong>Auskunft</strong> über deine gespeicherten Daten (Art. 15)</li>
        <li><strong>Berichtigung</strong> unrichtiger Daten (Art. 16)</li>
        <li><strong>Löschung</strong> deiner Daten (Art. 17, &quot;Recht auf Vergessenwerden&quot;)</li>
        <li><strong>Einschränkung</strong> der Verarbeitung (Art. 18)</li>
        <li><strong>Datenübertragbarkeit</strong> (Art. 20)</li>
        <li><strong>Widerspruch</strong> gegen die Verarbeitung (Art. 21)</li>
        <li><strong>Widerruf</strong> erteilter Einwilligungen (Art. 7 Abs. 3)</li>
      </ul>
      <p>Kontakt: <a href="mailto:datenschutz@cyclerun.app">datenschutz@cyclerun.app</a></p>
      <p>Du hast zudem das Recht, dich bei einer Aufsichtsbehörde zu beschweren.</p>

      <h2>7. Cookies &amp; Local Storage</h2>
      <p>CycleRun verwendet:</p>
      <ul>
        <li><strong>localStorage:</strong> Zum Speichern deiner Registrierung und App-Einstellungen lokal in deinem Browser. Keine Übertragung an Server.</li>
        <li><strong>Technisch notwendige Cookies:</strong> Nur für die grundlegende Funktionalität der Website (kein Tracking).</li>
      </ul>
      <p>Es werden <strong>keine Tracking-Cookies, kein Google Analytics und keine Werbe-Tracker</strong> eingesetzt.</p>

      <h2>8. Datensicherheit</h2>
      <p>Wir setzen technische und organisatorische Maßnahmen ein:</p>
      <ul>
        <li>HTTPS-Verschlüsselung (TLS 1.3)</li>
        <li>Row Level Security (RLS) auf Datenbankebene</li>
        <li>Keine Speicherung von Passwörtern (passwortlose Registrierung)</li>
        <li>Regelmäßige Sicherheits-Audits</li>
      </ul>

      <h2>9. Aufbewahrungsfristen</h2>
      <p>Deine Daten werden gespeichert, solange dein Account besteht. Nach Löschungsanfrage werden alle personenbezogenen Daten innerhalb von 30 Tagen unwiderruflich gelöscht.</p>

      <h2>10. Änderungen</h2>
      <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen. Die aktuelle Version ist stets auf dieser Seite verfügbar.</p>
    </div>
    <SubpageFooter />
    </>
  );
}
