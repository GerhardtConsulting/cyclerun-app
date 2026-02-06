export interface RouteData {
  slug: string;
  name: string;
  location: string;
  country: string;
  description: string;
  distanceKm: number;
  elevationM: number;
  difficulty: "Easy" | "Moderate" | "Hard" | "Very Hard";
  durationMin: number;
  elevationProfile: number[];
  content: string;
  keywords: string;
}

export const routes: RouteData[] = [
  {
    slug: "mallorca-cap-de-formentor",
    name: "Cap de Formentor",
    location: "Mallorca, Spain",
    country: "ES",
    description: "The iconic road to Mallorca's northernmost lighthouse. Dramatic cliff-side riding with turquoise Mediterranean views, steady climbs, and a breathtaking descent.",
    distanceKm: 18,
    elevationM: 340,
    difficulty: "Moderate",
    durationMin: 45,
    elevationProfile: [10, 15, 25, 40, 55, 70, 80, 85, 90, 95, 100, 95, 85, 70, 55, 40, 30, 20, 15, 10],
    keywords: "Mallorca cycling, Cap de Formentor bike, Mallorca cycling routes, POV cycling Mallorca, indoor cycling Mallorca",
    content: `Cap de Formentor is the crown jewel of Mallorca cycling. The 18km road from Port de Pollença to the lighthouse at the island's northernmost tip is one of the most photographed cycling routes in Europe.\n\nThe route begins gently along the coast before the road starts climbing through pine forests. As you gain elevation, the views become increasingly dramatic — sheer limestone cliffs dropping hundreds of meters to crystal-clear turquoise water below.\n\nThe road features several tunnels carved through rock, adding variety to the ride. The final kilometers to the lighthouse offer panoramic views of the entire northern coastline. On clear days, you can see Menorca in the distance.\n\nThis route is a staple of professional team training camps. Teams like INEOS Grenadiers and Jumbo-Visma regularly train here during winter months.`,
  },
  {
    slug: "stelvio-pass-italy",
    name: "Stelvio Pass",
    location: "South Tyrol, Italy",
    country: "IT",
    description: "One of the highest paved mountain passes in the Alps. 48 legendary hairpin turns, 1,800m of climbing, and cycling history on every switchback.",
    distanceKm: 24,
    elevationM: 1808,
    difficulty: "Very Hard",
    durationMin: 90,
    elevationProfile: [5, 10, 18, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 78, 82, 86, 90, 93, 96, 98, 100, 100, 100],
    keywords: "Stelvio Pass cycling, Stelvio bike climb, Alps cycling routes, hardest cycling climbs, Giro d'Italia Stelvio",
    content: `The Passo dello Stelvio at 2,757m is one of the highest paved passes in the Alps and a monument of cycling history. It has featured in the Giro d'Italia over 20 times, producing some of the race's most iconic moments.\n\nThe eastern approach from Prato allo Stelvio is the classic route: 24.3km at an average gradient of 7.4%. The 48 numbered hairpin turns are famous worldwide, each one marked with a stone monument.\n\nThe climb is relentless but rarely extreme — the gradient stays between 7-9% for most of the ascent, with occasional kicks to 12% on the steeper hairpins. The final kilometers above the tree line are exposed and spectacular.\n\nAt the summit, you're rewarded with views of the Ortler glacier and a panorama that stretches across three countries. The Stelvio is a climb every serious cyclist dreams of conquering.`,
  },
  {
    slug: "pacific-coast-highway-california",
    name: "Pacific Coast Highway",
    location: "California, USA",
    country: "US",
    description: "The legendary coastal highway between Big Sur and Monterey. Flat, scenic, and endlessly beautiful — ocean views, towering cliffs, and golden California light.",
    distanceKm: 35,
    elevationM: 120,
    difficulty: "Easy",
    durationMin: 60,
    elevationProfile: [50, 48, 52, 55, 50, 45, 48, 52, 50, 48, 55, 60, 55, 50, 48, 45, 50, 52, 50, 48],
    keywords: "Pacific Coast Highway cycling, California coastal cycling, Big Sur bike ride, PCH cycling, scenic cycling routes USA",
    content: `The Pacific Coast Highway (Highway 1) between Big Sur and Monterey is one of the most scenic drives in the world — and it's even better on two wheels.\n\nThis 35km stretch hugs the California coastline with the Pacific Ocean on one side and towering cliffs on the other. The route is almost entirely flat, making it perfect for long, steady efforts or recovery rides.\n\nHighlights include the Bixby Creek Bridge (one of the most photographed bridges in California), McWay Falls, and the endless views of the Pacific stretching to the horizon. The golden California light, especially during morning or evening rides, is simply magical.\n\nThe ambient sound of waves crashing below adds an extra dimension to the indoor riding experience. This is the route our community uses most for meditation and recovery sessions.`,
  },
  {
    slug: "alpe-d-huez-france",
    name: "Alpe d'Huez",
    location: "Isère, France",
    country: "FR",
    description: "The most famous climb in professional cycling. 21 legendary hairpin turns, each named after a Tour de France stage winner. 14km of pure climbing glory.",
    distanceKm: 14,
    elevationM: 1071,
    difficulty: "Very Hard",
    durationMin: 55,
    elevationProfile: [5, 15, 28, 40, 48, 55, 60, 65, 70, 72, 78, 82, 88, 92, 95, 97, 100, 100, 100, 100],
    keywords: "Alpe d'Huez cycling, Tour de France climb, Alpe d'Huez bike, famous cycling climbs France, 21 hairpins cycling",
    content: `Alpe d'Huez is the most famous climb in cycling. Since its Tour de France debut in 1952, it has become the ultimate test of a cyclist's climbing ability.\n\nThe 21 hairpin turns are numbered from 21 (bottom) to 1 (top), each bearing the name of a stage winner. The climb from Bourg-d'Oisans is 13.8km at an average gradient of 8.1%, but the first 4km are the steepest, hitting grades of 10-13%.\n\nThe atmosphere on this climb, even when riding virtually, is electric. The road is lined with painted names and messages from decades of Tour de France fans. Every switchback reveals a new view of the Romanche valley below.\n\nThe summit at 1,850m offers a stunning panorama of the Grandes Rousses massif. Whether you're a Tour de France fan or simply love a good climb, Alpe d'Huez is a bucket-list ride.`,
  },
  {
    slug: "trollstigen-norway",
    name: "Trollstigen",
    location: "Møre og Romsdal, Norway",
    country: "NO",
    description: "Norway's famous 'Troll Road' — dramatic switchbacks through fjord country with waterfalls, mist, and raw Scandinavian nature. Short but unforgettable.",
    distanceKm: 12,
    elevationM: 850,
    difficulty: "Hard",
    durationMin: 40,
    elevationProfile: [5, 12, 22, 35, 48, 55, 65, 75, 85, 92, 97, 100],
    keywords: "Trollstigen cycling, Norway cycling routes, fjord cycling, Scandinavian cycling, dramatic cycling climbs",
    content: `Trollstigen — the Troll's Path — is one of Norway's most dramatic mountain roads and a bucket-list destination for adventurous cyclists.\n\nThe road climbs 850 meters through 11 hairpin turns with gradients up to 12%. But it's not the numbers that make Trollstigen special — it's the landscape. Waterfalls cascade directly beside the road, mist drifts through the valley, and the raw power of Scandinavian nature is on full display.\n\nThe Stigfossen waterfall, which drops 320 meters right next to the road, is the most dramatic feature. On wet days, spray from the falls reaches the road surface.\n\nAt the top, a viewing platform cantilevers over the cliff edge, offering vertigo-inducing views of the road below. The descent (or in indoor cycling, the cool-down) is equally spectacular.\n\nThis route is unique in the CycleRun library — nothing else looks or feels like riding through a Norwegian fjord.`,
  },
];

export function getRoute(slug: string): RouteData | undefined {
  return routes.find((r) => r.slug === slug);
}

export function getAllRouteSlugs(): string[] {
  return routes.map((r) => r.slug);
}
