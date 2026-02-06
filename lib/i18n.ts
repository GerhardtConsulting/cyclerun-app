/**
 * CycleRun.app — Internationalization (i18n)
 * Primary: English, Secondary: German
 * Detection: navigator.language / manual override
 */

export type Locale = "en" | "de";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Splash
    "splash.tagline": "No smart trainer. No subscription. Just your webcam.",
    "splash.cycle.sub": "Spinning · Ergometer · Indoor Bike",
    "splash.run.sub": "Treadmill · Coming Soon",
    "splash.run.badge": "Soon",
    "splash.trust.fps": "60 FPS Tracking",
    "splash.trust.local": "100% Local",
    "splash.trust.free": "Free forever",
    "splash.learn": "Learn more",

    // Info section
    "info.title.1": "Your living room.",
    "info.title.2": "Your route.",
    "info.desc": "CycleRun transforms every home trainer workout into an immersive experience. Your webcam detects your movement — no smart trainer, no sensors, no subscription. Perfect for spinning bikes, ergometers, old home trainers and soon treadmills too.",
    "info.motion.title": "Motion Tracking",
    "info.motion.desc": "AI-powered motion detection measures your cadence in real-time — right in your browser.",
    "info.physics.title": "Physics Engine",
    "info.physics.desc": "Realistic acceleration, inertia and gear shifting. Feels like riding outdoors.",
    "info.video.title": "Any Video",
    "info.video.desc": "Use your own POV videos or browse featured routes. Your pace controls the speed.",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.q1": "Is CycleRun really free?",
    "faq.a1": "Yes, CycleRun is a community project and completely free. No subscription, no premium version, no hidden costs. You just need a webcam and a browser.",
    "faq.q2": "Which devices are compatible?",
    "faq.a2": "CycleRun works with any home trainer where legs move visibly: spinning bikes, ergometers, old home trainers, indoor bikes — even devices without Bluetooth or smart features. Running mode for treadmills is in development.",
    "faq.q3": "How does it work without sensors?",
    "faq.a3": "Your webcam detects your leg movement using AI-powered image analysis. You place detection zones over your knees or pedals — the software automatically recognizes your cadence. All processing runs locally in your browser.",
    "faq.q4": "How is this different from Zwift or Rouvy?",
    "faq.a4": "Zwift requires a smart trainer (from €300) and costs €17.99/month. Rouvy is similar. CycleRun is free and only uses your webcam — ideal if you want to upgrade your existing home trainer without investing in expensive hardware.",
    "faq.q5": "Are my webcam images stored?",
    "faq.a5": "No. All image processing happens exclusively locally in your browser. No images or videos are transmitted to our servers. Your privacy matters to us.",
    "faq.q6": "Can I use my old ergometer?",
    "faq.a6": "Yes! Whether your ergometer is 5 or 25 years old — as long as your legs move, CycleRun detects the motion. No smart trainer or sensors needed.",

    // Wizard
    "wizard.back": "← Back",
    "wizard.home": "← Home",
    "wizard.next": "Next",

    // Camera permission overlay
    "cam.perm.title": "CycleRun would like to access your camera",
    "cam.perm.desc": "Your webcam detects your leg movement in real-time. All processing happens locally in your browser — no images are ever transmitted.",
    "cam.perm.allow": "Allow Camera Access",
    "cam.perm.deny": "Not Now",
    "cam.perm.select": "Select Camera",
    "cam.perm.tip.title": "Using an external camera?",
    "cam.perm.tip.iphone": "On Mac, you can use your iPhone as a webcam via Continuity Camera — just hold your iPhone near your Mac and it appears as a camera option.",
    "cam.perm.tip.external": "USB webcams with wide-angle lenses (e.g. Logitech C920) provide the best tracking results.",
    "cam.perm.denied": "Camera access was denied. Please allow camera access in your browser settings to continue.",

    // Step 1
    "step1.label": "Step 1",
    "step1.title": "Let's get started",
    "step1.desc": "We need access to your camera and some info for the physics calculation.",
    "step1.camera.title": "Camera Access",
    "step1.camera.desc": "For motion detection",
    "step1.camera.btn": "Enable Camera",
    "step1.weight": "Weight",
    "step1.weight.hint": "For inertia calculation",
    "step1.height": "Height",
    "step1.height.hint": "For air resistance",
    "step1.bike": "Bike",
    "step1.bike.hint": "Total mass",
    "step1.body.title": "Body Data",
    "step1.body.optional": "Optional",
    "step1.body.why": "For realistic speed simulation and the best experience. Default values work fine too.",

    // Step 2
    "step2.label": "Step 2",
    "step2.title": "Camera Position",
    "step2.desc": "Choose the perspective of your webcam.",
    "step2.side": "SIDE",
    "step2.side.tag": "Recommended",
    "step2.front": "FRONT",
    "step2.front.tag": "Both legs",
    "step2.manual": "MANUAL",
    "step2.manual.tag": "Flexible",
    "step2.hint": "Side view recommended — knee movement is more clearly visible.",

    // Step 3
    "step3.label": "Step 3",
    "step3.title": "Detection Zones",
    "step3.desc": "Position the zones over your knees or pedals. They flash when motion is detected.",
    "step3.zones": "Zones",
    "step3.add": "Add pair",
    "step3.clear": "Clear all",
    "step3.resistance": "Resistance",
    "step3.light": "Light",
    "step3.medium": "Medium",
    "step3.heavy": "Heavy",
    "step3.gear.hint": "Higher resistance = more power needed for same speed",
    "step3.speed.title": "Speed Calibration",
    "step3.slower": "Slower",
    "step3.faster": "Faster",
    "step3.speed.hint": "Adjust if speed feels too high or too low",
    "step3.help.title": "How it works:",
    "step3.help.1": "Drag zones with your mouse",
    "step3.help.2": "Corner dot = resize",
    "step3.help.3": "Pedal to test detection",

    // Step 4
    "step4.label": "Step 4",
    "step4.title": "Ready to ride!",
    "step4.desc": "Test your setup with a few pedal strokes. The display should respond to your movement.",
    "step4.zones": "Zones placed",
    "step4.motion": "Motion detected",
    "step4.speed": "Speed > 0",
    "step4.start": "Start ride",

    // HUD
    "hud.distance": "Distance",
    "hud.time": "Time",
    "hud.strength": "Strength",
    "hud.gear": "Gear",
    "hud.gear.1": "Light",
    "hud.gear.2": "Medium",
    "hud.gear.3": "Heavy",

    // Video Modal
    "video.title": "Choose your route",
    "video.featured": "Featured Routes",
    "video.demo": "Demo Route (Sample Video)",
    "video.coming": "More routes coming soon — creators can submit POV videos.",
    "video.or": "or use your own video",
    "video.url.label": "Paste Video URL",
    "video.url.placeholder": "https://example.com/ride.mp4",
    "video.url.load": "Load",
    "video.url.hint": "Direct link to MP4 or WebM file",
    "video.upload.label": "Upload from Device",
    "video.upload.btn": "Choose local video file",
    "video.privacy": "Your video stays on your device. Nothing is uploaded to our servers.",

    // Registration
    "reg.title": "Keep riding for free",
    "reg.subtitle": "Register now to continue your training and save your stats.",
    "reg.first": "First name",
    "reg.last": "Last name (optional)",
    "reg.email": "Email address",
    "reg.consent": "I agree to the",
    "reg.privacy": "Privacy Policy",
    "reg.consent.2": ". My data will only be used to improve the product.",
    "reg.submit": "Register for free & continue riding",
    "reg.hint": "No password needed. No costs. Community project, non-profit.",

    // Cookie
    "cookie.title": "Your privacy matters.",
    "cookie.text": "CycleRun only uses technically necessary cookies and localStorage. No tracking, no ads, no Google Analytics.",
    "cookie.learn": "Learn more",
    "cookie.accept": "Got it",

    // Footer
    "footer.privacy": "Privacy Policy",
    "footer.legal": "Legal Notice",
    "footer.copy": "© 2026 CycleRun.app — Community project, non-profit",

    // Post-ride summary
    "ride.summary.title": "Ride Complete!",
    "ride.summary.great": "Great session",
    "ride.summary.distance": "Distance",
    "ride.summary.duration": "Duration",
    "ride.summary.avg.speed": "Avg Speed",
    "ride.summary.max.speed": "Max Speed",
    "ride.summary.avg.rpm": "Avg RPM",
    "ride.summary.calories": "Calories",
    "ride.summary.share": "Download Share Card",
    "ride.summary.share.hint": "9:16 transparent PNG — perfect for Instagram Stories",
    "ride.summary.save": "Save your progress",
    "ride.summary.save.hint": "Don't lose your stats! Register to keep your ride history.",
    "ride.summary.done": "Back to Home",
    "ride.summary.ride.again": "Ride Again",

    // Registration popup (during ride)
    "reg.popup.title": "Great start!",
    "reg.popup.subtitle": "You're riding at {speed} km/h. Register for free to save your training and unlock all features.",
    "reg.popup.saving": "Registering...",

    // Registration nudge (gamification badge)
    "nudge.title": "Save your ride?",
    "nudge.desc": "Register free to keep your stats",
    "nudge.cta": "Register",
    "nudge.dismiss": "Not now",
    "disconnect.tooltip": "Not registered — stats won't be saved",

    // Phone pairing
    "pair.title": "Connect Your Phone Camera",
    "pair.desc": "Scan the QR code with your phone to use its camera for motion tracking.",
    "pair.code.label": "Or enter this code at",
    "pair.waiting": "Waiting for connection...",
    "pair.connected": "Phone connected!",
    "pair.use.phone": "Use Phone Camera",
    "pair.skip": "Use webcam instead",

    // Newsletter
    "newsletter.opt_in": "Keep me updated on new features (no spam, GDPR compliant)",
    "newsletter.subscribed": "Check your email to confirm",

    // Loading
    "loading": "Loading...",

    // Simulator dynamic text
    "sim.camera.activating": "Activating camera...",
    "sim.camera.success": "✓ Camera activated! You can see your feed below.",
    "sim.camera.denied": "Camera access denied: ",
    "sim.zones.count": "{n} of 2 pairs",
    "sim.gear.light": "Light",
    "sim.gear.medium": "Medium",
    "sim.gear.heavy": "Heavy",
    "sim.target.reached": "✓ Reached!",
    "sim.video.error": "Video could not be loaded.\n\nPlease upload your own video (MP4 recommended).\n\nNote: Google Drive links don't work directly.",
    "sim.video.url.error": "Could not load video from URL.\n\nMake sure it's a direct link to an MP4 or WebM file.\nStreaming URLs (YouTube, Vimeo) are not supported.",
  },

  de: {
    // Splash
    "splash.tagline": "Kein Smart Trainer. Kein Abo. Nur deine Webcam.",
    "splash.cycle.sub": "Spinning · Ergometer · Indoor Bike",
    "splash.run.sub": "Laufband · Bald verfügbar",
    "splash.run.badge": "Bald",
    "splash.trust.fps": "60 FPS Tracking",
    "splash.trust.local": "100% Lokal",
    "splash.trust.free": "Kostenlos für immer",
    "splash.learn": "Mehr erfahren",

    // Info section
    "info.title.1": "Dein Wohnzimmer.",
    "info.title.2": "Deine Strecke.",
    "info.desc": "CycleRun verwandelt jedes Heimtrainer-Workout in ein immersives Erlebnis. Deine Webcam erkennt deine Bewegung — kein Smart Trainer, keine Sensoren, kein Abo. Perfekt für Spinning-Bikes, Ergometer, alte Heimtrainer und bald auch Laufbänder.",
    "info.motion.title": "Motion Tracking",
    "info.motion.desc": "KI-gestützte Bewegungserkennung erkennt deine Trittfrequenz in Echtzeit — direkt im Browser.",
    "info.physics.title": "Physik-Engine",
    "info.physics.desc": "Realistische Beschleunigung, Trägheit und Gangschaltung. Fühlt sich an wie draußen.",
    "info.video.title": "Jedes Video",
    "info.video.desc": "Lade eigene POV-Videos oder nutze die Featured Routes. Dein Tempo bestimmt die Geschwindigkeit.",

    // FAQ
    "faq.title": "Häufige Fragen",
    "faq.q1": "Ist CycleRun wirklich kostenlos?",
    "faq.a1": "Ja, CycleRun ist ein Community-Projekt und vollständig kostenlos. Kein Abo, keine Premium-Version, keine versteckten Kosten. Du brauchst nur eine Webcam und einen Browser.",
    "faq.q2": "Welche Geräte sind kompatibel?",
    "faq.a2": "CycleRun funktioniert mit jedem Heimtrainer, bei dem sich Beine sichtbar bewegen: Spinning-Bikes, Ergometer, alte Heimtrainer, Indoor Bikes — auch Geräte ohne Bluetooth oder Smart-Funktionen. Der Running-Modus für Laufbänder ist in Entwicklung.",
    "faq.q3": "Wie funktioniert das ohne Sensoren?",
    "faq.a3": "Deine Webcam erkennt die Bewegung deiner Beine per KI-gestützter Bildanalyse. Du platzierst Erkennungszonen über deinen Knien oder Pedalen — die Software erkennt automatisch deine Trittfrequenz. Die gesamte Verarbeitung läuft lokal in deinem Browser.",
    "faq.q4": "Was ist der Unterschied zu Zwift oder Rouvy?",
    "faq.a4": "Zwift erfordert einen Smart Trainer (ab €300) und kostet €17,99/Monat. Rouvy ähnlich. CycleRun ist kostenlos und nutzt nur deine Webcam — ideal, wenn du deinen vorhandenen Heimtrainer aufwerten möchtest, ohne in teure Hardware zu investieren.",
    "faq.q5": "Werden meine Webcam-Bilder gespeichert?",
    "faq.a5": "Nein. Die gesamte Bildverarbeitung findet ausschließlich lokal in deinem Browser statt. Es werden keine Bilder oder Videos an unsere Server übertragen. Deine Privatsphäre ist uns wichtig.",
    "faq.q6": "Kann ich mein altes Ergometer verwenden?",
    "faq.a6": "Ja! Egal ob dein Ergometer 5 oder 25 Jahre alt ist — solange sich deine Beine bewegen, erkennt CycleRun die Bewegung. Du brauchst keinen Smart Trainer und keine Sensoren.",

    // Wizard
    "wizard.back": "\u2190 Zur\u00fcck",
    "wizard.home": "\u2190 Startseite",
    "wizard.next": "Weiter",

    // Camera permission overlay
    "cam.perm.title": "CycleRun m\u00f6chte auf deine Kamera zugreifen",
    "cam.perm.desc": "Deine Webcam erkennt deine Beinbewegung in Echtzeit. Alle Daten werden lokal in deinem Browser verarbeitet \u2014 es werden keine Bilder \u00fcbertragen.",
    "cam.perm.allow": "Kamera-Zugriff erlauben",
    "cam.perm.deny": "Nicht jetzt",
    "cam.perm.select": "Kamera ausw\u00e4hlen",
    "cam.perm.tip.title": "Externe Kamera verwenden?",
    "cam.perm.tip.iphone": "Auf dem Mac kannst du dein iPhone als Webcam verwenden (Continuity Camera) \u2014 halte dein iPhone einfach in die N\u00e4he deines Macs.",
    "cam.perm.tip.external": "USB-Webcams mit Weitwinkel (z.B. Logitech C920) liefern die besten Tracking-Ergebnisse.",
    "cam.perm.denied": "Kamera-Zugriff wurde verweigert. Bitte erlaube den Zugriff in deinen Browser-Einstellungen.",

    // Step 1
    "step1.label": "Schritt 1",
    "step1.title": "Lass uns starten",
    "step1.desc": "Wir brauchen Zugriff auf deine Kamera und ein paar Infos f\u00fcr die Physik-Berechnung.",
    "step1.camera.title": "Kamera-Zugriff",
    "step1.camera.desc": "F\u00fcr die Bewegungserkennung",
    "step1.camera.btn": "Kamera aktivieren",
    "step1.weight": "Gewicht",
    "step1.weight.hint": "F\u00fcr Tr\u00e4gheitsberechnung",
    "step1.height": "Gr\u00f6\u00dfe",
    "step1.height.hint": "F\u00fcr Luftwiderstand",
    "step1.bike": "Fahrrad",
    "step1.bike.hint": "Gesamtmasse",
    "step1.body.title": "K\u00f6rperdaten",
    "step1.body.optional": "Optional",
    "step1.body.why": "F\u00fcr eine realistische Geschwindigkeitssimulation und das beste Erlebnis. Standardwerte funktionieren auch.",

    // Step 2
    "step2.label": "Schritt 2",
    "step2.title": "Kamera-Position",
    "step2.desc": "W\u00e4hle die Perspektive deiner Webcam.",
    "step2.side": "SEITE",
    "step2.side.tag": "Empfohlen",
    "step2.front": "FRONTAL",
    "step2.front.tag": "Beide Beine",
    "step2.manual": "MANUELL",
    "step2.manual.tag": "Flexibel",
    "step2.hint": "Seitenansicht empfohlen — Kniebewegung ist deutlicher sichtbar.",

    // Step 3
    "step3.label": "Schritt 3",
    "step3.title": "Erkennungszonen",
    "step3.desc": "Positioniere die Zonen über deinen Knien oder Pedalen. Sie blinken, wenn Bewegung erkannt wird.",
    "step3.zones": "Zonen",
    "step3.add": "Paar hinzufügen",
    "step3.clear": "Alle löschen",
    "step3.resistance": "Widerstand",
    "step3.light": "Leicht",
    "step3.medium": "Mittel",
    "step3.heavy": "Schwer",
    "step3.gear.hint": "Höherer Widerstand = mehr Kraft für gleiche Geschwindigkeit",
    "step3.speed.title": "Geschwindigkeits-Kalibrierung",
    "step3.slower": "Langsamer",
    "step3.faster": "Schneller",
    "step3.speed.hint": "Passe an, falls die Geschwindigkeit zu hoch oder niedrig ist",
    "step3.help.title": "So funktioniert's:",
    "step3.help.1": "Ziehe Zonen mit der Maus",
    "step3.help.2": "Eck-Punkt = Größe ändern",
    "step3.help.3": "Tritt in die Pedale zum Testen",

    // Step 4
    "step4.label": "Schritt 4",
    "step4.title": "Bereit zum Fahren!",
    "step4.desc": "Teste dein Setup mit ein paar Tritten. Die Anzeige sollte auf deine Bewegung reagieren.",
    "step4.zones": "Zonen platziert",
    "step4.motion": "Bewegung erkannt",
    "step4.speed": "Geschwindigkeit > 0",
    "step4.start": "Fahrt starten",

    // HUD
    "hud.distance": "Distanz",
    "hud.time": "Zeit",
    "hud.strength": "Stärke",
    "hud.gear": "Gang",
    "hud.gear.1": "Leicht",
    "hud.gear.2": "Mittel",
    "hud.gear.3": "Schwer",

    // Video Modal
    "video.title": "Strecke auswählen",
    "video.featured": "Featured Routes",
    "video.demo": "Demo-Strecke (Beispielvideo)",
    "video.coming": "Mehr Strecken bald verfügbar — Creator können POV-Videos einreichen.",
    "video.or": "oder eigenes Video verwenden",
    "video.url.label": "Video-URL einfügen",
    "video.url.placeholder": "https://beispiel.de/fahrt.mp4",
    "video.url.load": "Laden",
    "video.url.hint": "Direktlink zu MP4 oder WebM Datei",
    "video.upload.label": "Von Gerät hochladen",
    "video.upload.btn": "Lokale Videodatei wählen",
    "video.privacy": "Dein Video bleibt auf deinem Gerät. Es wird nichts auf unsere Server hochgeladen.",

    // Registration
    "reg.title": "Kostenlos weiterfahren",
    "reg.subtitle": "Registriere dich jetzt, um dein Training fortzusetzen und deine Statistiken zu speichern.",
    "reg.first": "Vorname",
    "reg.last": "Nachname (optional)",
    "reg.email": "E-Mail-Adresse",
    "reg.consent": "Ich stimme der",
    "reg.privacy": "Datenschutzerklärung",
    "reg.consent.2": " zu. Meine Daten werden nur zur Verbesserung des Produkts verwendet.",
    "reg.submit": "Kostenfrei registrieren & weiterfahren",
    "reg.hint": "Kein Passwort nötig. Keine Kosten. Community-Projekt ohne Gewinnabsicht.",

    // Cookie
    "cookie.title": "Datenschutz ist uns wichtig.",
    "cookie.text": "CycleRun verwendet nur technisch notwendige Cookies und localStorage. Kein Tracking, keine Werbung, kein Google Analytics.",
    "cookie.learn": "Mehr erfahren",
    "cookie.accept": "Verstanden",

    // Footer
    "footer.privacy": "Datenschutz",
    "footer.legal": "Impressum",
    "footer.copy": "© 2026 CycleRun.app — Community-Projekt ohne Gewinnabsicht",

    // Post-ride summary
    "ride.summary.title": "Fahrt beendet!",
    "ride.summary.great": "Starke Session",
    "ride.summary.distance": "Distanz",
    "ride.summary.duration": "Dauer",
    "ride.summary.avg.speed": "\u2300 Geschw.",
    "ride.summary.max.speed": "Max Geschw.",
    "ride.summary.avg.rpm": "\u2300 RPM",
    "ride.summary.calories": "Kalorien",
    "ride.summary.share": "Share Card herunterladen",
    "ride.summary.share.hint": "9:16 transparentes PNG \u2014 perfekt f\u00fcr Instagram Stories",
    "ride.summary.save": "Fortschritt sichern",
    "ride.summary.save.hint": "Verliere deine Statistiken nicht! Registriere dich, um deine Fahrten zu speichern.",
    "ride.summary.done": "Zur\u00fcck zur Startseite",
    "ride.summary.ride.again": "Nochmal fahren",

    // Registration popup (during ride)
    "reg.popup.title": "Starker Start!",
    "reg.popup.subtitle": "Du f\u00e4hrst gerade {speed} km/h. Registriere dich kostenlos, um dein Training zu speichern.",
    "reg.popup.saving": "Wird registriert...",

    // Registration nudge (gamification badge)
    "nudge.title": "Fahrt speichern?",
    "nudge.desc": "Kostenlos registrieren & Statistiken behalten",
    "nudge.cta": "Registrieren",
    "nudge.dismiss": "Sp\u00e4ter",
    "disconnect.tooltip": "Nicht registriert \u2014 Statistiken werden nicht gespeichert",

    // Phone pairing
    "pair.title": "Handy-Kamera verbinden",
    "pair.desc": "Scanne den QR-Code mit deinem Handy, um dessen Kamera f\u00fcr die Bewegungserkennung zu nutzen.",
    "pair.code.label": "Oder gib diesen Code ein unter",
    "pair.waiting": "Warte auf Verbindung...",
    "pair.connected": "Handy verbunden!",
    "pair.use.phone": "Handy-Kamera nutzen",
    "pair.skip": "Webcam verwenden",

    // Newsletter
    "newsletter.opt_in": "\u00dcber neue Features informieren (kein Spam, DSGVO-konform)",
    "newsletter.subscribed": "Pr\u00fcfe dein Postfach zur Best\u00e4tigung",

    // Loading
    "loading": "Lade...",

    // Simulator dynamic text
    "sim.camera.activating": "Kamera wird aktiviert...",
    "sim.camera.success": "✓ Kamera aktiviert! Du siehst dein Kamerabild unten.",
    "sim.camera.denied": "Kamera-Zugriff verweigert: ",
    "sim.zones.count": "{n} von 2 Paaren",
    "sim.gear.light": "Leicht",
    "sim.gear.medium": "Mittel",
    "sim.gear.heavy": "Schwer",
    "sim.target.reached": "✓ Erreicht!",
    "sim.video.error": "Video konnte nicht geladen werden.\n\nBitte lade ein eigenes Video hoch (MP4 empfohlen).\n\nHinweis: Google Drive Links funktionieren nicht direkt.",
    "sim.video.url.error": "Video konnte nicht von URL geladen werden.\n\nStelle sicher, dass es ein Direktlink zu einer MP4 oder WebM Datei ist.\nStreaming-URLs (YouTube, Vimeo) werden nicht unterstützt.",
  },
};

let currentLocale: Locale = "en";
const listeners: Set<() => void> = new Set();

/** Detect language from browser */
function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("cyclerun_lang");
  if (saved === "de" || saved === "en") return saved;
  const nav = navigator.language || "";
  return nav.startsWith("de") ? "de" : "en";
}

/** Initialize locale (call once on mount) */
export function initLocale(): Locale {
  currentLocale = detectLocale();
  return currentLocale;
}

/** Get current locale */
export function getLocale(): Locale {
  return currentLocale;
}

/** Set locale and persist */
export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("cyclerun_lang", locale);
    document.documentElement.lang = locale;
  }
  listeners.forEach((fn) => fn());
}

/** Subscribe to locale changes */
export function onLocaleChange(fn: () => void) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

/** Translate a key */
export function t(key: string, params?: Record<string, string | number>): string {
  let text = translations[currentLocale]?.[key] || translations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}
