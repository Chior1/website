import { AppShell } from "@/components/AppShell";
import { UploadSimulator } from "@/components/UploadSimulator";

export default function NewTaskPage() {
  return (
    <AppShell active="项目">
      <div className="workspace-header">
        <div>
          <h1>选择要处理的文件类型</h1>
          <p className="muted">
            当前阶段是原型演示，选择类型后会进入对应的示例结果页。
          </p>
        </div>
      </div>
      <UploadSimulator />
    </AppShell>
  );
}

