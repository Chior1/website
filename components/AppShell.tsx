import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { label: "项目", href: "/dashboard" },
  { label: "音频纪要", href: "/audio-summary" },
  { label: "视频字幕", href: "/video-subtitles" },
  { label: "导出中心", href: "/dashboard#exports" },
  { label: "真实接入", href: "/integration-review" },
  { label: "团队空间", href: "/dashboard#team" },
  { label: "设置", href: "/settings" }
];

export function AppShell({
  active,
  children
}: {
  active: string;
  children: ReactNode;
}) {
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">听</span>
          <span>听墨</span>
        </Link>
        <nav className="side-nav" aria-label="工作台导航">
          {navItems.map((item) => (
            <Link
              className={item.label === active ? "active" : ""}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
