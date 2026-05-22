// src/components/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FileText,
  Key,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/payments", icon: ArrowLeftRight, label: "Pagamentos" },
  { to: "/statement", icon: FileText, label: "Extrato" },
  { to: "/pix-keys", icon: Key, label: "Chaves PIX" },
  { to: "/settings", icon: Settings, label: "Configurações" },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "US";

  return (
    <aside className="sidebar-bg w-60 flex-shrink-0 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-sm">
          <Building2 size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">
            FinTech Bank
          </p>
          <p className="text-blue-300 text-[11px]">Portal do Cliente</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-accent/30 border border-accent/40 flex items-center justify-center text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {user?.email}
            </p>
            <p className="text-blue-300 text-[10px] uppercase tracking-wide">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-link w-full text-red-300 hover:text-red-200 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
