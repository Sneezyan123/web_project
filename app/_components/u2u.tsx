import type { ChannelItem } from "@/lib/channels";
import SharedChannelCard from "@/components/ChannelCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileShell } from "@/components/layout/MobileShell";

export { MobileShell, Header, Footer };

export const topicPills = [
  { label: "Англійська мова", icon: "/collection-icons/%F0%9F%87%BA%F0%9F%87%B8.png" },
  { label: "Ігрові світи та лор", icon: "/collection-icons/gamepad.png" },
  { label: "Книги", icon: "/collection-icons/books.png" },
  { label: "Трукрайм", icon: "/collection-icons/officer.png" },
  { label: "Аніме", icon: "/collection-icons/flowers.png" },
  { label: "Шортси", icon: "/collection-icons/shorts.png" },
  { label: "Новини", icon: "/collection-icons/news.png" },
  { label: "Навчання", icon: "/collection-icons/notes.png" },
  { label: "Летсплеї", icon: "/collection-icons/joystick.png" },
] as const;

export function ChannelCard({
  channel,
  compact = false,
  showBookmark = false,
}: {
  channel: ChannelItem;
  compact?: boolean;
  showBookmark?: boolean;
}) {
  return <SharedChannelCard channel={channel} compact={compact} isBookmarked={compact && showBookmark} />;
}
