import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;800&display=swap');

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --border: rgba(255,255,255,0.07);
    --accent: #ff3cac;
    --accent2: #7b2fff;
    --accent3: #00f5d4;
    --text: #f0eeff;
    --muted: rgba(240,238,255,0.45);
    --glow: 0 0 40px rgba(255,60,172,0.25);
  }

  .header-root {
    font-family: 'Syne', sans-serif;
    background: var(--bg);
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 100;
  }

  /* Animated noise grain overlay */
  .header-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  /* Moving gradient blob */
  .header-blob {
    position: absolute;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(123,47,255,0.18) 0%, transparent 70%);
    top: -160px;
    left: 50%;
    transform: translateX(-50%);
    animation: blobPulse 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes blobPulse {
    0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.7; }
    50% { transform: translateX(-50%) scale(1.25); opacity: 1; }
  }

  /* Logo */
  .header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    text-decoration: none;
    cursor: pointer;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 0 18px rgba(255,60,172,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    flex-shrink: 0;
  }

  .header-logo:hover .logo-icon {
    box-shadow: 0 0 30px rgba(255,60,172,0.65), inset 0 1px 0 rgba(255,255,255,0.15);
    transform: rotate(-4deg) scale(1.05);
  }

  .logo-wordmark {
    display: flex;
    flex-direction: column;
    line-height: 1;
  }

  .logo-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 0.08em;
    background: linear-gradient(90deg, #fff 0%, var(--accent) 60%, var(--accent2) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .logo-tag {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* Nav */
  .header-nav {
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
    z-index: 1;
  }

  .nav-pill {
    position: relative;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--muted);
    cursor: pointer;
    background: transparent;
    border: none;
    transition: color 0.2s ease;
    white-space: nowrap;
  }

  .nav-pill:hover {
    color: var(--text);
  }

  .nav-pill.active {
    color: var(--text);
  }

  .nav-pill.active::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 18px;
    height: 2px;
    border-radius: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    box-shadow: 0 0 8px var(--accent);
  }

  /* Status badge */
  .status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px 5px 8px;
    border-radius: 20px;
    background: rgba(0, 245, 212, 0.07);
    border: 1px solid rgba(0, 245, 212, 0.2);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--accent3);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent3);
    box-shadow: 0 0 6px var(--accent3);
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Right actions */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 9px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 16px;
    flex-shrink: 0;
  }

  .icon-btn:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06);
    transform: translateY(-1px);
  }

  .avatar-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent2) 0%, var(--accent) 100%);
    border: 2px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 0 14px rgba(255,60,172,0.3);
    position: relative;
    flex-shrink: 0;
  }

  .avatar-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 0 22px rgba(255,60,172,0.55);
  }

  .avatar-notif {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--accent3);
    border: 2px solid var(--bg);
    box-shadow: 0 0 6px var(--accent3);
  }

  /* Divider */
  .header-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
    flex-shrink: 0;
  }

  /* Shimmer line at top */
  .header-shimmer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--accent2) 30%,
      var(--accent) 50%,
      var(--accent3) 70%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 4s linear infinite;
    opacity: 0.8;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Slide in animation */
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header-root {
    animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
`;

type NavItem =  "Chat" |"Log Out" | "History";

interface PageHeaderProps {
  userName?: string;
  userInitials?: string;
  activeNav?: NavItem;
  onNavChange?: (item: NavItem) => void;
  notificationCount?: number;
}

export default function PageHeader({
  userName = "U",
  userInitials,
  activeNav = "Chat",
  onNavChange,
  notificationCount = 0,
}: PageHeaderProps) {
  const [active, setActive] = useState<NavItem>(activeNav);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const initials = userInitials ?? userName.slice(0, 2).toUpperCase();

  const navItems: NavItem[] = ["Chat", "Log Out", "History"];

  const handleNav = (item: NavItem) => {
    setActive(item);
    onNavChange?.(item);
  };

  if (!mounted) return null;

  return (
    <>
      <style>{styles}</style>
      <header className="header-root">
        {/* Ambient blob */}
        <div className="header-blob" />

        {/* Top shimmer line */}
        <div className="header-shimmer" />

        {/* Logo */}
        <div className="header-logo">
          <div className="logo-icon">💬</div>
          <div className="logo-wordmark">
            <span className="logo-name">chat-brat</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="header-nav">
          {navItems.map((item) => (
            <button
              key={item}
              className={`nav-pill ${active === item ? "active" : ""}`}
              onClick={() => handleNav(item)}
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="header-actions">
          {/* Online status */}
          <div className="status-badge">
            <span className="status-dot" />
            Online
          </div>


        </div>
      </header>
    </>
  );
}


export function Branding(){
    return (
        <div className="brand">
            <div className="brand-name">Chat-Brat</div>
            <div className="brand-tagline">Your AI, unfiltered. Always on.</div>
          </div>
    );
}