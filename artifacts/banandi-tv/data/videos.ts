export interface Episode {
  id: number;
  title: string;
  episodeNum: number;
  duration: string;
  vod_url: string;
  thumbnail?: string;
}

export interface Video {
  id: number;
  title: string;
  cover: string;
  description: string;
  category: string;
  categoryId: number;
  date: string;
  rating: number;
  duration: string;
  type: "movie" | "series";
  play_url: string;
  episodes?: Episode[];
  isFree: boolean;
  views: string;
  country: string;
  tags: string[];
}

const TMDB_BASE = "https://image.tmdb.org/t/p/w500";

export const CATEGORIES = [
  { id: 0, name: "Tout" },
  { id: 1, name: "Films" },
  { id: 2, name: "Séries" },
  { id: 3, name: "Action" },
  { id: 4, name: "Comédie" },
  { id: 5, name: "Drame" },
  { id: 6, name: "Horreur" },
  { id: 7, name: "Animation" },
];

export const VIDEOS: Video[] = [
  {
    id: 1,
    title: "Inception",
    cover: `${TMDB_BASE}/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg`,
    description: "Un voleur qui s'infiltre dans les rêves des autres pour leur voler des secrets se voit offrir une chance de les effacer en plantant une idée dans l'esprit d'une cible.",
    category: "Action",
    categoryId: 3,
    date: "2010",
    rating: 8.8,
    duration: "2h 28min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFree: true,
    views: "2.1M",
    country: "USA",
    tags: ["Sci-Fi", "Thriller", "Action"],
  },
  {
    id: 2,
    title: "The Dark Knight",
    cover: `${TMDB_BASE}/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    description: "Batman relève le défi du Joker, criminel qui jette Gotham City dans l'anarchie absolue.",
    category: "Action",
    categoryId: 3,
    date: "2008",
    rating: 9.0,
    duration: "2h 32min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isFree: true,
    views: "3.4M",
    country: "USA",
    tags: ["Action", "Crime", "Drame"],
  },
  {
    id: 3,
    title: "Interstellar",
    cover: `${TMDB_BASE}/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    description: "Une équipe d'explorateurs voyage à travers un trou de ver dans l'espace à la recherche d'une nouvelle planète habitable.",
    category: "Drame",
    categoryId: 5,
    date: "2014",
    rating: 8.6,
    duration: "2h 49min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFree: true,
    views: "1.8M",
    country: "USA",
    tags: ["Sci-Fi", "Drame", "Aventure"],
  },
  {
    id: 4,
    title: "Breaking Bad",
    cover: `${TMDB_BASE}/ggFHVNu6YYI5L9pCfOacjizRGt.jpg`,
    description: "Un professeur de chimie atteint d'un cancer incurable se tourne vers la fabrication et le trafic de drogue pour assurer l'avenir de sa famille.",
    category: "Drame",
    categoryId: 5,
    date: "2008",
    rating: 9.5,
    duration: "47min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFree: true,
    views: "5.2M",
    country: "USA",
    tags: ["Crime", "Drame", "Thriller"],
    episodes: [
      { id: 401, title: "Pilote", episodeNum: 1, duration: "58min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: 402, title: "Le Chat dans le sac", episodeNum: 2, duration: "48min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 403, title: "...Et le sac dans la rivière", episodeNum: 3, duration: "48min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { id: 404, title: "Cancer Man", episodeNum: 4, duration: "48min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    ],
  },
  {
    id: 5,
    title: "Money Heist",
    cover: `${TMDB_BASE}/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg`,
    description: "Un génie du crime planifie le plus grand braquage de l'histoire, ciblant la Monnaie Royale d'Espagne.",
    category: "Action",
    categoryId: 3,
    date: "2017",
    rating: 8.3,
    duration: "50min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isFree: true,
    views: "4.1M",
    country: "Espagne",
    tags: ["Thriller", "Crime", "Action"],
    episodes: [
      { id: 501, title: "Tout avait été planifié", episodeNum: 1, duration: "50min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 502, title: "Implosion", episodeNum: 2, duration: "52min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: 503, title: "Tokyo ", episodeNum: 3, duration: "49min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    ],
  },
  {
    id: 6,
    title: "The Witcher",
    cover: `${TMDB_BASE}/7vjaCdMw15FEbXyLQTVa04URsPm.jpg`,
    description: "Geralt de Riv, un chasseur de monstres solitaire, lutte pour trouver sa place dans un monde où les humains s'avèrent souvent plus maléfiques que les bêtes.",
    category: "Action",
    categoryId: 3,
    date: "2019",
    rating: 8.2,
    duration: "60min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFree: true,
    views: "3.7M",
    country: "USA",
    tags: ["Fantasy", "Action", "Aventure"],
    episodes: [
      { id: 601, title: "Le commencement de la fin", episodeNum: 1, duration: "58min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { id: 602, title: "Quatre Marks", episodeNum: 2, duration: "55min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 603, title: "Trahison lune", episodeNum: 3, duration: "58min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
    ],
  },
  {
    id: 7,
    title: "Parasite",
    cover: `${TMDB_BASE}/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    description: "Une famille sans le sou s'infiltre dans la vie d'une riche famille en se faisant passer pour des travailleurs qualifiés sans aucun lien entre eux.",
    category: "Drame",
    categoryId: 5,
    date: "2019",
    rating: 8.6,
    duration: "2h 12min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFree: true,
    views: "1.2M",
    country: "Corée",
    tags: ["Thriller", "Drame", "Crime"],
  },
  {
    id: 8,
    title: "Avengers: Endgame",
    cover: `${TMDB_BASE}/or06FN3Dka5tukK1e9sl16pB3iy.jpg`,
    description: "Après les événements dévastateurs d'Infinity War, l'univers est en ruines. Les Avengers restants se rassemblent pour inverser les actions de Thanos.",
    category: "Action",
    categoryId: 3,
    date: "2019",
    rating: 8.4,
    duration: "3h 1min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isFree: true,
    views: "6.8M",
    country: "USA",
    tags: ["Action", "Aventure", "Sci-Fi"],
  },
  {
    id: 9,
    title: "Squid Game",
    cover: `${TMDB_BASE}/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg`,
    description: "Des centaines de joueurs criblés de dettes acceptent une invitation bizarre à concourir dans des jeux pour enfants. Un prix de 45,6 milliards de wons est en jeu.",
    category: "Drame",
    categoryId: 5,
    date: "2021",
    rating: 8.0,
    duration: "55min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFree: true,
    views: "9.1M",
    country: "Corée",
    tags: ["Thriller", "Drame", "Action"],
    episodes: [
      { id: 901, title: "Rose, Marguerite, Ciseaux", episodeNum: 1, duration: "60min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { id: 902, title: "L'Enfer", episodeNum: 2, duration: "64min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 903, title: "L'Homme au parapluie", episodeNum: 3, duration: "56min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: 904, title: "Emprunter de l'argent est aussi facile que rien", episodeNum: 4, duration: "53min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    ],
  },
  {
    id: 10,
    title: "Spider-Man: No Way Home",
    cover: `${TMDB_BASE}/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg`,
    description: "Peter Parker demande à Doctor Strange de l'aider à faire oublier son identité secrète à tout le monde, mais une terrible erreur ouvre un portail vers d'autres univers.",
    category: "Action",
    categoryId: 3,
    date: "2021",
    rating: 8.2,
    duration: "2h 28min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFree: true,
    views: "4.5M",
    country: "USA",
    tags: ["Action", "Aventure", "Sci-Fi"],
  },
  {
    id: 11,
    title: "Stranger Things",
    cover: `${TMDB_BASE}/49WJfeN0moxb9IPfGn8AIqMGskD.jpg`,
    description: "Quand un jeune garçon disparaît, une petite ville découvre un mystère impliquant des expériences secrètes, des forces surnaturelles terrifiantes.",
    category: "Horreur",
    categoryId: 6,
    date: "2016",
    rating: 8.7,
    duration: "51min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isFree: true,
    views: "7.3M",
    country: "USA",
    tags: ["Horreur", "Sci-Fi", "Mystère"],
    episodes: [
      { id: 1101, title: "Chapitre Un : La disparition de Will Byers", episodeNum: 1, duration: "49min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 1102, title: "Chapitre Deux : La Barjot", episodeNum: 2, duration: "55min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: 1103, title: "Chapitre Trois : Holly, Jolly", episodeNum: 3, duration: "51min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    ],
  },
  {
    id: 12,
    title: "Le Lion de la Savane",
    cover: `${TMDB_BASE}/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg`,
    description: "La vie d'un lion dans les vastes plaines de la savane africaine, de sa naissance à son règne sur la troupe.",
    category: "Animation",
    categoryId: 7,
    date: "2022",
    rating: 7.8,
    duration: "1h 45min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFree: true,
    views: "890K",
    country: "France",
    tags: ["Animation", "Aventure", "Famille"],
  },
  {
    id: 13,
    title: "The Office",
    cover: `${TMDB_BASE}/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg`,
    description: "Une série de comédie mockumentaire sur la vie quotidienne des employés d'une entreprise de papier à Scranton, en Pennsylvanie.",
    category: "Comédie",
    categoryId: 4,
    date: "2005",
    rating: 9.0,
    duration: "22min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFree: true,
    views: "8.2M",
    country: "USA",
    tags: ["Comédie", "Mockumentaire"],
    episodes: [
      { id: 1301, title: "Pilot", episodeNum: 1, duration: "22min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
      { id: 1302, title: "Diversity Day", episodeNum: 2, duration: "22min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: 1303, title: "Health Care", episodeNum: 3, duration: "22min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
    ],
  },
  {
    id: 14,
    title: "Get Out",
    cover: `${TMDB_BASE}/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg`,
    description: "Un jeune homme afro-américain visite la famille de sa petite amie blanche pour un week-end et découvre un secret terrifiant.",
    category: "Horreur",
    categoryId: 6,
    date: "2017",
    rating: 7.7,
    duration: "1h 44min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    isFree: true,
    views: "1.4M",
    country: "USA",
    tags: ["Horreur", "Thriller", "Mystère"],
  },
  {
    id: 15,
    title: "One Piece",
    cover: `${TMDB_BASE}/cMD9Ygz11zjJzAovURpO75Gc68d.jpg`,
    description: "Monkey D. Luffy et ses équipiers pirates cherchent le légendaire trésor One Piece pour faire de Luffy le Roi des Pirates.",
    category: "Animation",
    categoryId: 7,
    date: "1999",
    rating: 9.0,
    duration: "24min/ép",
    type: "series",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    isFree: true,
    views: "12M",
    country: "Japon",
    tags: ["Animation", "Aventure", "Action"],
    episodes: [
      { id: 1501, title: "Je suis Luffy ! L'homme qui deviendra le Roi des Pirates !", episodeNum: 1, duration: "24min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
      { id: 1502, title: "Grand corsaire Zoro ! Mystère de la grande épée!", episodeNum: 2, duration: "24min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 1503, title: "Vierge de la mer ! Nami, la navigatrice de l'équipage !", episodeNum: 3, duration: "24min", vod_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    ],
  },
  {
    id: 16,
    title: "Joker",
    cover: `${TMDB_BASE}/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg`,
    description: "À Gotham City, l'acteur de comédie raté et le demi-fou Arthur Fleck descend dans la folie et devient le Joker.",
    category: "Drame",
    categoryId: 5,
    date: "2019",
    rating: 8.5,
    duration: "2h 2min",
    type: "movie",
    play_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    isFree: true,
    views: "3.9M",
    country: "USA",
    tags: ["Drame", "Crime", "Thriller"],
  },
];

export const TRENDING = VIDEOS.slice(0, 5);
export const MOVIES = VIDEOS.filter((v) => v.type === "movie");
export const SERIES = VIDEOS.filter((v) => v.type === "series");

export function getVideosByCategory(categoryId: number): Video[] {
  if (categoryId === 0) return VIDEOS;
  if (categoryId === 1) return MOVIES;
  if (categoryId === 2) return SERIES;
  return VIDEOS.filter((v) => v.categoryId === categoryId);
}

export function searchVideos(query: string): Video[] {
  const q = query.toLowerCase();
  return VIDEOS.filter(
    (v) =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.tags.some((t) => t.toLowerCase().includes(q)) ||
      v.category.toLowerCase().includes(q)
  );
}
