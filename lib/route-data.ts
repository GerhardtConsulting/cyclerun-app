export interface RouteData {
  slug: string;
  name: string;
  location: string;
  location_de?: string;
  country: string;
  description: string;
  description_de?: string;
  distanceKm: number;
  elevationM: number;
  difficulty: "Easy" | "Moderate" | "Hard" | "Very Hard";
  durationMin: number;
  elevationProfile: number[];
  content: string;
  content_de?: string;
  keywords: string;
}

export const routes: RouteData[] = [
  {
    slug: "mallorca-cap-de-formentor",
    name: "Cap de Formentor",
    location: "Mallorca, Spain",
    location_de: "Mallorca, Spanien",
    country: "ES",
    description: "The iconic road to Mallorca's northernmost lighthouse. Dramatic cliff-side riding with turquoise Mediterranean views, steady climbs, and a breathtaking descent.",
    description_de: "Die ikonische Stra\u00dfe zum n\u00f6rdlichsten Leuchtturm Mallorcas. Dramatische Klippen-Fahrten mit t\u00fcrkisfarbenem Mittelmeerblick, stetigen Anstiegen und einer atemberaubenden Abfahrt.",
    distanceKm: 18,
    elevationM: 340,
    difficulty: "Moderate",
    durationMin: 45,
    elevationProfile: [10, 15, 25, 40, 55, 70, 80, 85, 90, 95, 100, 95, 85, 70, 55, 40, 30, 20, 15, 10],
    keywords: "Mallorca cycling, Cap de Formentor bike, Mallorca cycling routes, POV cycling Mallorca, indoor cycling Mallorca",
    content: `Cap de Formentor is the crown jewel of Mallorca cycling. The 18km road from Port de Pollença to the lighthouse at the island's northernmost tip is one of the most photographed cycling routes in Europe.\n\nThe route begins gently along the coast before the road starts climbing through pine forests. As you gain elevation, the views become increasingly dramatic — sheer limestone cliffs dropping hundreds of meters to crystal-clear turquoise water below.\n\nThe road features several tunnels carved through rock, adding variety to the ride. The final kilometers to the lighthouse offer panoramic views of the entire northern coastline. On clear days, you can see Menorca in the distance.\n\nThis route is a staple of professional team training camps. Teams like INEOS Grenadiers and Jumbo-Visma regularly train here during winter months.`,
    content_de: `Cap de Formentor ist das Kronjuwel des Radsports auf Mallorca. Die 18 km lange Stra\u00dfe von Port de Pollen\u00e7a zum Leuchtturm an der n\u00f6rdlichsten Spitze der Insel ist eine der meistfotografierten Radstrecken Europas.\n\nDie Route beginnt sanft entlang der K\u00fcste, bevor die Stra\u00dfe durch Pinienw\u00e4lder ansteigt. Mit zunehmender H\u00f6he werden die Ausblicke immer dramatischer \u2014 steile Kalksteinklippen, die hunderte Meter in kristallklares, t\u00fcrkisfarbenes Wasser abfallen.\n\nDie Stra\u00dfe f\u00fchrt durch mehrere in den Fels gehauene Tunnel, die der Fahrt Abwechslung verleihen. Die letzten Kilometer zum Leuchtturm bieten Panoramablicke auf die gesamte Nordk\u00fcste. An klaren Tagen kann man Menorca in der Ferne sehen.\n\nDiese Strecke ist ein fester Bestandteil professioneller Team-Trainingslager. Teams wie INEOS Grenadiers und Jumbo-Visma trainieren hier regelm\u00e4\u00dfig in den Wintermonaten.`,
  },
  {
    slug: "stelvio-pass-italy",
    name: "Stelvio Pass",
    location: "South Tyrol, Italy",
    location_de: "S\u00fcdtirol, Italien",
    country: "IT",
    description: "One of the highest paved mountain passes in the Alps. 48 legendary hairpin turns, 1,800m of climbing, and cycling history on every switchback.",
    description_de: "Einer der h\u00f6chsten asphaltierten Bergp\u00e4sse der Alpen. 48 legend\u00e4re Haarnadelkurven, 1.800 m H\u00f6henunterschied und Radsportgeschichte an jeder Kehre.",
    distanceKm: 24,
    elevationM: 1808,
    difficulty: "Very Hard",
    durationMin: 90,
    elevationProfile: [5, 10, 18, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 78, 82, 86, 90, 93, 96, 98, 100, 100, 100],
    keywords: "Stelvio Pass cycling, Stelvio bike climb, Alps cycling routes, hardest cycling climbs, Giro d'Italia Stelvio",
    content_de: `Der Passo dello Stelvio auf 2.757 m ist einer der h\u00f6chsten asphaltierten P\u00e4sse der Alpen und ein Denkmal der Radsportgeschichte. Er war \u00fcber 20 Mal Teil des Giro d'Italia und hat einige der ikonischsten Momente des Rennens hervorgebracht.\n\nDer \u00f6stliche Aufstieg von Prato allo Stelvio ist die klassische Route: 24,3 km bei einer durchschnittlichen Steigung von 7,4%. Die 48 nummerierten Haarnadelkurven sind weltweit ber\u00fchmt, jede mit einem Steindenkmal markiert.\n\nDer Anstieg ist unerbittlich, aber selten extrem \u2014 die Steigung bleibt f\u00fcr den Gro\u00dfteil des Aufstiegs zwischen 7-9%, mit gelegentlichen Spitzen bis 12% an den steileren Kehren.\n\nAm Gipfel wirst du mit Blicken auf den Ortler-Gletscher und einem Panorama belohnt, das sich \u00fcber drei L\u00e4nder erstreckt. Der Stelvio ist ein Anstieg, von dem jeder ernsthafte Radfahrer tr\u00e4umt.`,
    content: `The Passo dello Stelvio at 2,757m is one of the highest paved passes in the Alps and a monument of cycling history. It has featured in the Giro d'Italia over 20 times, producing some of the race's most iconic moments.\n\nThe eastern approach from Prato allo Stelvio is the classic route: 24.3km at an average gradient of 7.4%. The 48 numbered hairpin turns are famous worldwide, each one marked with a stone monument.\n\nThe climb is relentless but rarely extreme — the gradient stays between 7-9% for most of the ascent, with occasional kicks to 12% on the steeper hairpins. The final kilometers above the tree line are exposed and spectacular.\n\nAt the summit, you're rewarded with views of the Ortler glacier and a panorama that stretches across three countries. The Stelvio is a climb every serious cyclist dreams of conquering.`,
  },
  {
    slug: "pacific-coast-highway-california",
    name: "Pacific Coast Highway",
    location: "California, USA",
    location_de: "Kalifornien, USA",
    country: "US",
    description: "The legendary coastal highway between Big Sur and Monterey. Flat, scenic, and endlessly beautiful — ocean views, towering cliffs, and golden California light.",
    description_de: "Die legend\u00e4re K\u00fcstenstra\u00dfe zwischen Big Sur und Monterey. Flach, malerisch und endlos sch\u00f6n \u2014 Meerblick, aufragende Klippen und goldenes kalifornisches Licht.",
    distanceKm: 35,
    elevationM: 120,
    difficulty: "Easy",
    durationMin: 60,
    elevationProfile: [50, 48, 52, 55, 50, 45, 48, 52, 50, 48, 55, 60, 55, 50, 48, 45, 50, 52, 50, 48],
    keywords: "Pacific Coast Highway cycling, California coastal cycling, Big Sur bike ride, PCH cycling, scenic cycling routes USA",
    content_de: `Der Pacific Coast Highway (Highway 1) zwischen Big Sur und Monterey ist eine der malerischsten Straßen der Welt — und auf zwei Rädern noch besser.\n\nDiese 35 km lange Strecke schmiegt sich an die kalifornische Küste, mit dem Pazifischen Ozean auf der einen Seite und aufragenden Klippen auf der anderen. Die Route ist fast vollständig flach, perfekt für lange, gleichmäßige Einheiten oder Erholungsfahrten.\n\nHighlights sind die Bixby Creek Bridge, McWay Falls und die endlosen Blicke auf den Pazifik. Das goldene kalifornische Licht, besonders bei Morgen- oder Abendfahrten, ist einfach magisch.\n\nDas Ambiente der unter dir brechenden Wellen fügt dem Indoor-Erlebnis eine zusätzliche Dimension hinzu. Diese Strecke wird von unserer Community am meisten für Meditations- und Erholungseinheiten genutzt.`,
    content: `The Pacific Coast Highway (Highway 1) between Big Sur and Monterey is one of the most scenic drives in the world — and it's even better on two wheels.\n\nThis 35km stretch hugs the California coastline with the Pacific Ocean on one side and towering cliffs on the other. The route is almost entirely flat, making it perfect for long, steady efforts or recovery rides.\n\nHighlights include the Bixby Creek Bridge (one of the most photographed bridges in California), McWay Falls, and the endless views of the Pacific stretching to the horizon. The golden California light, especially during morning or evening rides, is simply magical.\n\nThe ambient sound of waves crashing below adds an extra dimension to the indoor riding experience. This is the route our community uses most for meditation and recovery sessions.`,
  },
  {
    slug: "alpe-d-huez-france",
    name: "Alpe d'Huez",
    location: "Isère, France",
    location_de: "Isère, Frankreich",
    country: "FR",
    description: "The most famous climb in professional cycling. 21 legendary hairpin turns, each named after a Tour de France stage winner. 14km of pure climbing glory.",
    description_de: "Der berühmteste Anstieg im Profi-Radsport. 21 legendäre Haarnadelkurven, jede nach einem Tour-de-France-Etappensieger benannt. 14 km purer Kletter-Ruhm.",
    distanceKm: 14,
    elevationM: 1071,
    difficulty: "Very Hard",
    durationMin: 55,
    elevationProfile: [5, 15, 28, 40, 48, 55, 60, 65, 70, 72, 78, 82, 88, 92, 95, 97, 100, 100, 100, 100],
    keywords: "Alpe d'Huez cycling, Tour de France climb, Alpe d'Huez bike, famous cycling climbs France, 21 hairpins cycling",
    content_de: `Alpe d'Huez ist der berühmteste Anstieg im Radsport. Seit seinem Tour-de-France-Debüt 1952 ist er zum ultimativen Test der Kletterfähigkeiten eines Radfahrers geworden.\n\nDie 21 Haarnadelkurven sind von 21 (unten) bis 1 (oben) nummeriert, jede mit dem Namen eines Etappensiegers. Der Anstieg von Bourg-d'Oisans ist 13,8 km lang bei einer durchschnittlichen Steigung von 8,1%, aber die ersten 4 km sind am steilsten mit Steigungen von 10-13%.\n\nDie Straße ist mit gemalten Namen und Botschaften aus Jahrzehnten von Tour-de-France-Fans gesäumt. Jede Kehre bietet einen neuen Blick auf das Romanche-Tal.\n\nDer Gipfel auf 1.850 m bietet ein atemberaubendes Panorama des Grandes-Rousses-Massivs. Ob Tour-de-France-Fan oder einfach ein Liebhaber guter Anstiege — Alpe d'Huez ist eine Bucket-List-Fahrt.`,
    content: `Alpe d'Huez is the most famous climb in cycling. Since its Tour de France debut in 1952, it has become the ultimate test of a cyclist's climbing ability.\n\nThe 21 hairpin turns are numbered from 21 (bottom) to 1 (top), each bearing the name of a stage winner. The climb from Bourg-d'Oisans is 13.8km at an average gradient of 8.1%, but the first 4km are the steepest, hitting grades of 10-13%.\n\nThe atmosphere on this climb, even when riding virtually, is electric. The road is lined with painted names and messages from decades of Tour de France fans. Every switchback reveals a new view of the Romanche valley below.\n\nThe summit at 1,850m offers a stunning panorama of the Grandes Rousses massif. Whether you're a Tour de France fan or simply love a good climb, Alpe d'Huez is a bucket-list ride.`,
  },
  {
    slug: "trollstigen-norway",
    name: "Trollstigen",
    location: "Møre og Romsdal, Norway",
    location_de: "Møre og Romsdal, Norwegen",
    country: "NO",
    description: "Norway's famous 'Troll Road' — dramatic switchbacks through fjord country with waterfalls, mist, and raw Scandinavian nature. Short but unforgettable.",
    description_de: "Norwegens berühmte 'Trollstraße' — dramatische Serpentinen durch Fjordland mit Wasserfällen, Nebel und wilder skandinavischer Natur. Kurz aber unvergesslich.",
    distanceKm: 12,
    elevationM: 850,
    difficulty: "Hard",
    durationMin: 40,
    elevationProfile: [5, 12, 22, 35, 48, 55, 65, 75, 85, 92, 97, 100],
    keywords: "Trollstigen cycling, Norway cycling routes, fjord cycling, Scandinavian cycling, dramatic cycling climbs",
    content_de: `Trollstigen \u2014 der Trollpfad \u2014 ist eine der dramatischsten Bergstra\u00dfen Norwegens und ein Bucket-List-Ziel f\u00fcr abenteuerlustige Radfahrer.\n\nDie Stra\u00dfe klettert 850 Meter \u00fcber 11 Haarnadelkurven mit Steigungen bis zu 12%. Aber es sind nicht die Zahlen, die Trollstigen besonders machen \u2014 es ist die Landschaft. Wasserf\u00e4lle st\u00fcrzen direkt neben der Stra\u00dfe hinab, Nebel zieht durch das Tal und die rohe Kraft der skandinavischen Natur ist allgegenw\u00e4rtig.\n\nDer Stigfossen-Wasserfall, der 320 Meter direkt neben der Stra\u00dfe f\u00e4llt, ist das dramatischste Merkmal.\n\nAm Gipfel ragt eine Aussichtsplattform \u00fcber den Klippenrand hinaus und bietet schwindelerregende Blicke auf die Stra\u00dfe darunter. Diese Strecke ist einzigartig in der CycleRun-Bibliothek \u2014 nichts anderes sieht so aus oder f\u00fchlt sich so an wie eine Fahrt durch einen norwegischen Fjord.`,
    content: `Trollstigen — the Troll's Path — is one of Norway's most dramatic mountain roads and a bucket-list destination for adventurous cyclists.\n\nThe road climbs 850 meters through 11 hairpin turns with gradients up to 12%. But it's not the numbers that make Trollstigen special — it's the landscape. Waterfalls cascade directly beside the road, mist drifts through the valley, and the raw power of Scandinavian nature is on full display.\n\nThe Stigfossen waterfall, which drops 320 meters right next to the road, is the most dramatic feature. On wet days, spray from the falls reaches the road surface.\n\nAt the top, a viewing platform cantilevers over the cliff edge, offering vertigo-inducing views of the road below. The descent (or in indoor cycling, the cool-down) is equally spectacular.\n\nThis route is unique in the CycleRun library — nothing else looks or feels like riding through a Norwegian fjord.`,
  },
];

export function getRoute(slug: string): RouteData | undefined {
  return routes.find((r) => r.slug === slug);
}

export function getAllRouteSlugs(): string[] {
  return routes.map((r) => r.slug);
}
