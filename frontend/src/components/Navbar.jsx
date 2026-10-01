import {
  Bell,
  Menu,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = ({ title = "Dashboard", onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="flex h-full items-center justify-between px-5 sm:px-8">

        {/* Left */}
        <div className="flex items-center gap-4">

          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="hidden text-xs text-slate-500 sm:block">
              Manage your cards and payments
            </p>
          </div>

        </div>


        {/* Right */}
        <div className="flex items-center gap-4">

          <button className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">

            <Bell className="h-5 w-5" />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />

          </button>


          <div className="hidden h-8 w-px bg-slate-200 sm:block" />


          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="hidden text-right sm:block">

              <p className="text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.is_admin ? "Administrator" : "Customer"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Navbar;