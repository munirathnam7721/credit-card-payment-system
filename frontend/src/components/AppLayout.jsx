import { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import {
  BarChart3,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  Receipt,
  ShieldCheck,
  X,
} from "lucide-react";

import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/cards": "My Cards",
  "/payment": "Make Payment",
  "/transactions": "Transactions",
  "/admin": "Admin Dashboard",
};

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const location = useLocation();
  const { user, logout } = useAuth();

  const title =
    pageTitles[location.pathname] || "CardPay";

  const navigation = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Cards",
      path: "/cards",
      icon: CreditCard,
    },
    {
      name: "Make Payment",
      path: "/payment",
      icon: Receipt,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: History,
    },
  ];

  if (user?.is_admin) {
    navigation.push({
      name: "Admin Dashboard",
      path: "/admin",
      icon: BarChart3,
    });
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">

        <Logo />

        <Navigation
          navigation={navigation}
        />

        <UserSection
          user={user}
          logout={handleLogout}
        />

      </aside>


      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}


      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

          <Logo />

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        <Navigation
          navigation={navigation}
          onNavigate={() => setMobileMenuOpen(false)}
        />

        <UserSection
          user={user}
          logout={handleLogout}
        />

      </aside>


      {/* Main */}
      <div className="lg:pl-64">

        <Navbar
          title={title}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};


const Logo = () => {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
        <CreditCard className="h-5 w-5 text-white" />
      </div>

      <div>
        <h1 className="text-lg font-bold text-slate-900">
          CardPay
        </h1>

        <p className="text-xs text-slate-500">
          Payment System
        </p>
      </div>

    </div>
  );
};


const Navigation = ({
  navigation,
  onNavigate,
}) => {
  return (
    <nav className="flex-1 space-y-1 px-4 py-6">

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Main Menu
      </p>

      {navigation.map((item) => {

        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <Icon className="h-5 w-5" />

            <span>{item.name}</span>
          </NavLink>
        );
      })}

    </nav>
  );
};


const UserSection = ({
  user,
  logout,
}) => {
  return (
    <div className="border-t border-slate-100 p-4">

      <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="min-w-0 flex-1">

          <p className="truncate text-sm font-semibold text-slate-900">
            {user?.name || "User"}
          </p>

          <p className="truncate text-xs text-slate-500">
            {user?.email}
          </p>

        </div>

      </div>

      {user?.is_admin && (
        <div className="mb-3 flex items-center gap-2 px-2 text-xs text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          Administrator
        </div>
      )}

      <button
        onClick={logout}
        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-5 w-5" />
        Sign out
      </button>

    </div>
  );
};

export default AppLayout;