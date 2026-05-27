import { AppShell } from "@/components/AppShell";
import { AudioSummaryEditor } from "@/components/AudioSummaryEditor";

export default function AudioSummaryPage() {
  return (
    <AppShell active="音频纪要">
      <AudioSummaryEditor />
    </AppShell>
  );
}
