import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type NavItem =  "Chat" |"Log Out" | "History";

interface PageHeaderProps {}
export default function PageHeader({}: PageHeaderProps) {
  const navigate = useNavigate();
  const [active, setActive] = useState<NavItem>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);


  const navItems: NavItem[] = ["Chat", "Log Out", "History"];

  const handleNav = (item: NavItem) => {
    if (item === "Log Out") {      
         localStorage.removeItem("token");
         localStorage.removeItem("user");
         navigate("/login");
         return;
    }
    if (item === "Chat") {      
        navigate('/chat');
        setActive(item);
        return;
    }
    setActive(item);
  };

  if (!mounted) return null;

  return (
    <>
      <header className="header-root">
        <div className="header-blob" />
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
              onClick={() => handleNav(item)}>
              {item}
            </button>
          ))}
        </nav>
        <div className="header-actions">
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