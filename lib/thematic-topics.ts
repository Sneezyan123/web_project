export type ThematicTopic = {
  name: string;
  emoji: string;
  keywords: string[];
  legacyNames?: string[];
};

function topicSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яіїєґ\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const THEMATIC_COLLECTION_TOPICS: ThematicTopic[] = [
  { name: "Letsplays", emoji: "🕹", keywords: ["летсплей", "летсплеї", "летсплеи", "letsplay"], legacyNames: ["Летсплеї"] },
  { name: "English", emoji: "🇺🇸", keywords: ["англійська", "english"], legacyNames: ["Англійська мова"] },
  { name: "Books", emoji: "📚", keywords: ["книга", "книги", "книжков", "books"], legacyNames: ["Книги"] },
  {
    name: "Game Worlds and Lore",
    emoji: "🎮",
    keywords: ["ігрові світи", "лор", "lore", "game world"],
    legacyNames: ["Ігрові світи та лор"],
  },
  { name: "News", emoji: "📰", keywords: ["новини", "новин", "news"], legacyNames: ["Новини"] },
  { name: "True Crime", emoji: "👮", keywords: ["трукрайм", "true crime"], legacyNames: ["Трукрайм"] },
  { name: "Anime", emoji: "🌸", keywords: ["аніме", "anime"], legacyNames: ["Аніме"] },
  { name: "Learning", emoji: "🎓", keywords: ["навчання", "навчальн", "learning"], legacyNames: ["Навчання"] },
  { name: "Science", emoji: "🔬", keywords: ["наука", "науков", "science"], legacyNames: ["Наука"] },
  { name: "Education", emoji: "🏫", keywords: ["освіта", "освіт", "education"], legacyNames: ["Освіта"] },
  { name: "IT", emoji: "💻", keywords: ["айті", "технолог", "програм", "про it", "it україн"], legacyNames: ["Айті"] },
  { name: "Movies", emoji: "🎥", keywords: ["кіно", "фільм", "cinema", "movies"], legacyNames: ["Кіно"] },
  { name: "Reviews", emoji: "🔎", keywords: ["огляд", "огляди", "review"], legacyNames: ["Огляди"] },
  { name: "Humor", emoji: "😂", keywords: ["гумор", "комед", "humor"], legacyNames: ["Гумор"] },
  { name: "Travel", emoji: "✈️", keywords: ["подорож", "travel"], legacyNames: ["Подорожі"] },
  { name: "Lifestyle", emoji: "🛍️", keywords: ["лайфстайл", "lifestyle"], legacyNames: ["Лайфстайл"] },
  { name: "Culture", emoji: "🏺", keywords: ["культура", "cultural", "culture"], legacyNames: ["Культура"] },
  { name: "Mythology", emoji: "🧙‍♀", keywords: ["міфолог", "myth", "mythology"], legacyNames: ["Міфологія"] },
  { name: "Japanese", emoji: "⛩", keywords: ["японськ", "japanese"], legacyNames: ["Японська мова"] },
  { name: "Ukrainian", emoji: "🇺🇦", keywords: ["українськ", "ukrainian language"], legacyNames: ["Українська мова"] },
  { name: "Design", emoji: "🎨", keywords: ["дизайн", "design"], legacyNames: ["Дизайн"] },
  { name: "Spanish", emoji: "🇪🇸", keywords: ["іспанськ", "spanish"], legacyNames: ["Іспанська мова"] },
  { name: "Covers", emoji: "🎤", keywords: ["кавер", "cover", "covers"], legacyNames: ["Кавери"] },
  { name: "Stand-up", emoji: "🕺", keywords: ["стендап", "stand-up", "standup"], legacyNames: ["Стендап"] },
  { name: "Dubbing", emoji: "🎧", keywords: ["озвучен", "dubbing", "voice"], legacyNames: ["Озвучення"] },
  { name: "Interviews", emoji: "🗣", keywords: ["інтерв", "interview"], legacyNames: ["Інтерв'ю"] },
  { name: "Religion", emoji: "✝️", keywords: ["релігі", "religion"], legacyNames: ["Релігія"] },
  { name: "Chess", emoji: "♟️", keywords: ["шахи", "chess"], legacyNames: ["Шахи"] },
  { name: "Football", emoji: "⚽", keywords: ["футбол", "football", "soccer"], legacyNames: ["Футбол"] },
  { name: "Theater", emoji: "🎭", keywords: ["театр", "theatre", "theater"], legacyNames: ["Театр"] },
  { name: "DIY", emoji: "🧩", keywords: ["diy", "зроби сам"] },
  { name: "Podcasts", emoji: "🎙", keywords: ["подкаст", "podcast"], legacyNames: ["Подкасти"] },
  { name: "French", emoji: "🇫🇷", keywords: ["французьк", "french"], legacyNames: ["Французька мова"] },
  { name: "Music", emoji: "🎵", keywords: ["музика", "music"], legacyNames: ["Музика"] },
  { name: "Drawing", emoji: "🖌️", keywords: ["малюван", "drawing", "art"], legacyNames: ["Малювання"] },
  { name: "Space", emoji: "🚀", keywords: ["космос", "space"], legacyNames: ["Космос"] },
  { name: "History", emoji: "📜", keywords: ["істор", "history"], legacyNames: ["Історія"] },
  { name: "For Kids", emoji: "👶", keywords: ["для дітей", "дітям", "kids"], legacyNames: ["Для дітей"] },
];

export function thematicTopicNames(topic: ThematicTopic): string[] {
  return [topic.name, ...(topic.legacyNames ?? [])];
}

export function thematicTopicLabel(topic: ThematicTopic): string {
  return topic.legacyNames?.[0] ?? topic.name;
}

export function findThematicTopic(labelOrSlug: string): ThematicTopic | undefined {
  const label = labelOrSlug.trim();
  if (!label) return undefined;
  const slug = topicSlug(label);

  return THEMATIC_COLLECTION_TOPICS.find((item) => {
    if (item.name === label) return true;
    if (topicSlug(item.name) === slug) return true;
    return item.legacyNames?.some((legacy) => legacy === label || topicSlug(legacy) === slug);
  });
}

export const REGISTER_TOPIC_OPTIONS = THEMATIC_COLLECTION_TOPICS.map((topic) => ({
  name: thematicTopicLabel(topic),
  emoji: topic.emoji,
}));
