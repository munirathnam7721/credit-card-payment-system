import {
  Activity,
  CreditCard,
  Grid2X2,
  LogOut,
  ShieldCheck,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const mainMenuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Grid2X2,
    },
    {
      name: "My Cards",
      path: "/cards",
      icon: CreditCard,
    },
    {
      name: "Make Payment",
      path: "/payment",
      icon: WalletCards,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: Activity,
    },
  ];

  const adminMenuItems = [
    {
      name: "Admin Dashboard",
      path: "/admin",
      icon: ShieldCheck,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Cards",
      path: "/admin/cards",
      icon: CreditCard,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: Activity,
    },
  ];

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-600 shadow-sm"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[274px] flex-col border-r border-slate-200 bg-white">

      {/* =========================
          LOGO
      ========================== */}
      <div className="flex h-[92px] items-center border-b border-slate-100 px-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
            <CreditCard className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              CardPay
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Payment System
            </p>
          </div>

        </div>

      </div>

      {/* =========================
          NAVIGATION
      ========================== */}
      <div className="flex-1 overflow-y-auto px-4 py-7">

        {/* MAIN MENU */}
        <div>

          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">

            {mainMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={linkClass}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-5 w-5 transition ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-500 group-hover:text-slate-700"
                        }`}
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}

          </nav>

        </div>

        {/* =========================
            ADMIN MENU
        ========================== */}

        {user?.is_admin && (
          <div className="mt-8">

            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>

            <nav className="space-y-1">

              {adminMenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={linkClass}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`h-5 w-5 transition ${
                            isActive
                              ? "text-blue-600"
                              : "text-slate-500 group-hover:text-slate-700"
                          }`}
                        />

                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}

            </nav>

          </div>
        )}

      </div>

      {/* =========================
          USER PROFILE
      ========================== */}

      <div className="border-t border-slate-100 p-4">

        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <UserRound className="h-5 w-5 text-blue-600" />
          </div>

          <div className="min-w-0 flex-1">

            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "User"}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email || ""}
            </p>

          </div>

        </div>

        {/* ADMIN BADGE */}
        {user?.is_admin && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">

            <ShieldCheck className="h-4 w-4 text-blue-600" />

            <span className="text-xs font-semibold text-blue-700">
              Administrator
            </span>

          </div>
        )}

        {/* SIGN OUT */}
        <button
          type="button"
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
        >

          <LogOut className="h-5 w-5 transition group-hover:text-red-600" />

          <span>Sign out</span>

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;