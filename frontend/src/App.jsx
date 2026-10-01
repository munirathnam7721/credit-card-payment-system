import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Payment from "./pages/Payment";
import Transactions from "./pages/Transactions";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminCards from "./pages/AdminCards";
import AdminTransactions from "./pages/AdminTransactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            CUSTOMER ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/cards"
              element={<Cards />}
            />

            <Route
              path="/payment"
              element={<Payment />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

          </Route>

        </Route>


        {/* =========================
            ADMIN ROUTES
        ========================== */}

        <Route element={<AdminProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsers />}
          />

          <Route
            path="/admin/cards"
            element={<AdminCards />}
          />

          <Route
            path="/admin/transactions"
            element={<AdminTransactions />}
          />

        </Route>


        {/* =========================
            DEFAULT ROUTES
        ========================== */}

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;