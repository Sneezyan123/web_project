export function sanitizeRichHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}

export function formatChannelAboutHtml(about: string) {
  const trimmed = about.trim();
  if (!trimmed) return "";
  const html = trimmed.includes("<") ? trimmed : trimmed.replace(/\n/g, "<br />");
  return sanitizeRichHtml(html);
}
