import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = {
  to: string;
  label: string;
  icon: React.ReactNode;
  match?: (path: string) => boolean;
};

const tabs: Tab[] = [
  { to: "/", label: "Início", icon: <Home className="h-5 w-5" />, match: p => p === "/" },
  { to: "/dashboard", label: "Bombons", icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: "/minha-conta", label: "Conta", icon: <User className="h-5 w-5" /> },
];

const MobileTabBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 dark:border-white/10
                 bg-white/80 dark:bg-[#20123d]/80 backdrop-blur supports-[backdrop-filter]:bg-white/60
                 md:hidden"
      role="navigation"
      aria-label="App bottom navigation"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-3 gap-1 px-2 py-2">
        {tabs.map((t) => {
          const active = t.match ? t.match(path) : path.startsWith(t.to);
          return (
            <li key={t.to}>
              <Link
                to={t.to}
                className={cn(
                  "group flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "transition",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  aria-hidden="true"
                >
                  {t.icon}
                </span>
                <span>{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileTabBar;
