import Link from "next/link";

export function TopNav() {
  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">听</span>
          <span>听墨</span>
        </Link>
        <nav className="nav" aria-label="首页导航">
          <a href="#features">产品功能</a>
          <a href="#pricing">价格</a>
          <a href="#privacy">隐私安全</a>
          <a href="#help">帮助文档</a>
        </nav>
        <div className="actions">
          <Link className="button secondary" href="/dashboard">
            登录
          </Link>
          <Link className="button primary" href="/new">
            开始使用
          </Link>
        </div>
      </div>
    </header>
  );
}
