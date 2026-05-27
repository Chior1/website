import { AppShell } from "@/components/AppShell";
import { SettingsInteractions } from "@/components/SettingsInteractions";

export default function SettingsPage() {
  return (
    <AppShell active="设置">
      <div className="workspace-header">
        <div>
          <h1>设置与隐私</h1>
          <p className="muted">把文件删除、隐私提示和导出格式说明提前放出来。</p>
        </div>
      </div>

      <SettingsInteractions />
    </AppShell>
  );
}
