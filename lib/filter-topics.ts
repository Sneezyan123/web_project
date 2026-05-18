export type FilterTopicDefinition = {
  label: string;
  keywords: string[];
};

export const FILTER_TOPIC_DEFINITIONS: FilterTopicDefinition[] = [
  { label: "Освіта", keywords: ["освіта", "освітн", "навчання", "школа", "зно", "нмт"] },
  { label: "Гумор", keywords: ["гумор", "комед", "стендап", "жарт"] },
  { label: "Подорожі", keywords: ["подорож", "travel", "туризм", "відпочинок"] },
  { label: "Музика", keywords: ["музика", "music", "кавер", "пісн", "реп"] },
  { label: "Технології", keywords: ["технолог", "айті", "програм", "софт", "комп'ютер", "про it", "it україн", "тестування пз"] },
  { label: "Геймінг", keywords: ["ігр", "геймінг", "летсплей", "летсплеї", "letsplay", "стрім", "fps", "геймплей"] },
  { label: "Кулінарія", keywords: ["кулінар", "рецепт", "готув", "кухн", "food"] },
  { label: "Лайфстайл", keywords: ["лайфстайл", "lifestyle", "блог", "влог"] },
  { label: "Мистецтво", keywords: ["мистецт", "art", "малюван", "дизайн", "творч"] },
  { label: "Новини та аналітика", keywords: ["новин", "аналіт", "політик", "поді"] },
  { label: "Історія та документалістика", keywords: ["істор", "документал", "history"] },
  { label: "DIY", keywords: ["diy", "зроби сам", "майстер", "ремонт"] },
];

export const FILTER_TOPICS = FILTER_TOPIC_DEFINITIONS.map((item) => item.label);

export function getFilterTopicKeywords(label: string): string[] {
  const match = FILTER_TOPIC_DEFINITIONS.find((item) => item.label === label);
  if (match) return match.keywords;
  return [label.replace(/[.*+?^${}()|[\]\\]/g, "").toLowerCase()];
}
