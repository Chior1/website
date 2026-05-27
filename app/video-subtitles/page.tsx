import { AppShell } from "@/components/AppShell";
import { SubtitleEditor } from "@/components/SubtitleEditor";

export default function VideoSubtitlesPage() {
  return (
    <AppShell active="视频字幕">
      <SubtitleEditor />
    </AppShell>
  );
}
