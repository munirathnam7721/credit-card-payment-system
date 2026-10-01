import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  CreditCard,
  DollarSign,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  UserRound,
  Users,
  XCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  exportTransactionsCSV,
  getAdminCards,
  getAdminTransactions,
  getAdminUsers,
  getDailyPaymentSummary,
} from "../services/adminService";

import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dailySummary, setDailySummary] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const loadAdminData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        usersData,
        cardsData,
        transactionsData,
        summaryData,
      ] = await Promise.all([
        getAdminUsers(),
        getAdminCards(),
        getAdminTransactions(),
        getDailyPaymentSummary(),
      ]);

      setUsers(usersData);
      setCards(cardsData);
      setTransactions(transactionsData);
      setDailySummary(summaryData);
    } catch (err) {
      console.error("Unable to load admin dashboard:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load admin dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);

      const blob = await exportTransactionsCSV();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "transactions.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV export failed:", err);

      alert("Unable to export transactions.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  const successfulTransactions = transactions.filter(
    (transaction) => transaction.status === "SUCCESS"
  );

  const failedTransactions = transactions.filter(
    (transaction) => transaction.status === "FAILED"
  );

  const pendingTransactions = transactions.filter(
    (transaction) => transaction.status === "PENDING"
  );

  const totalSuccessfulAmount = successfulTransactions.reduce(
    (total, transaction) =>
      total + Number(transaction.amount || 0),
    0
  );

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Total Cards",
      value: cards.length,
      icon: CreditCard,
      description: "Saved cards",
    },
    {
      title: "Transactions",
      value: transactions.length,
      icon: Activity,
      description: "All transactions",
    },
    {
      title: "Successful",
      value: successfulTransactions.length,
      icon: CheckCircle2,
      description: "Successful payments",
    },
    {
      title: "Failed",
      value: failedTransactions.length,
      icon: XCircle,
      description: "Failed payments",
    },
    {
      title: "Successful Amount",
      value: `₹${totalSuccessfulAmount.toFixed(2)}`,
      icon: TrendingUp,
      description: "Total successful value",
    },
  ];

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* =========================
            HEADER
        ========================== */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />

              <p className="text-sm font-semibold text-blue-600">
                Administration
              </p>
            </div>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Monitor users, cards, payments and transaction activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={loadAdminData}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowDownToLine className="h-4 w-4" />

              {exporting
                ? "Exporting..."
                : "Export CSV"}
            </button>

          </div>
        </div>

        {/* =========================
            ERROR
        ========================== */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =========================
            STATISTICS
        ========================== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-950">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* =========================
            ADMIN MANAGEMENT
        ========================== */}
        <div className="mt-8">

          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-950">
              Management
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Quickly access users, cards and transaction records.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* USERS */}
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>

                <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Users
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                View all registered users and administrator accounts.
              </p>

              <div className="mt-5 flex items-end justify-between">

                <div>
                  <p className="text-3xl font-bold text-slate-950">
                    {users.length}
                  </p>

                  <p className="text-xs text-slate-400">
                    Registered users
                  </p>
                </div>

                <span className="text-sm font-semibold text-blue-600">
                  View Users
                </span>

              </div>

            </button>

            {/* CARDS */}
            <button
              type="button"
              onClick={() => navigate("/admin/cards")}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <CreditCard className="h-6 w-6 text-indigo-600" />
                </div>

                <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600" />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Cards
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                View customer cards using secure masked card details.
              </p>

              <div className="mt-5 flex items-end justify-between">

                <div>
                  <p className="text-3xl font-bold text-slate-950">
                    {cards.length}
                  </p>

                  <p className="text-xs text-slate-400">
                    Saved cards
                  </p>
                </div>

                <span className="text-sm font-semibold text-indigo-600">
                  View Cards
                </span>

              </div>

            </button>

            {/* TRANSACTIONS */}
            <button
              type="button"
              onClick={() => navigate("/admin/transactions")}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>

                <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />

              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Transactions
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Monitor all customer payment transactions and statuses.
              </p>

              <div className="mt-5 flex items-end justify-between">

                <div>
                  <p className="text-3xl font-bold text-slate-950">
                    {transactions.length}
                  </p>

                  <p className="text-xs text-slate-400">
                    Total transactions
                  </p>
                </div>

                <span className="text-sm font-semibold text-emerald-600">
                  View Transactions
                </span>

              </div>

            </button>

          </div>

        </div>

        {/* =========================
            PAYMENT STATUS
        ========================== */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* SUCCESS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Successful Payments
                </p>

                <p className="text-xs text-slate-500">
                  Completed transactions
                </p>
              </div>

            </div>

            <p className="mt-5 text-3xl font-bold text-emerald-600">
              {successfulTransactions.length}
            </p>

          </div>

          {/* FAILED */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Failed Payments
                </p>

                <p className="text-xs text-slate-500">
                  Failed transactions
                </p>
              </div>

            </div>

            <p className="mt-5 text-3xl font-bold text-red-600">
              {failedTransactions.length}
            </p>

          </div>

          {/* PENDING */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Pending Payments
                </p>

                <p className="text-xs text-slate-500">
                  Currently pending
                </p>
              </div>

            </div>

            <p className="mt-5 text-3xl font-bold text-amber-600">
              {pendingTransactions.length}
            </p>

          </div>

        </div>

        {/* =========================
            DAILY SUMMARY
        ========================== */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Daily Payment Summary
                </h2>

                <p className="text-xs text-slate-500">
                  Payment activity grouped by date
                </p>
              </div>

            </div>

          </div>

          {dailySummary.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">
              No daily payment data available.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left">

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Transactions
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Successful
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Failed
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Successful Amount
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {dailySummary.map((day) => (
                    <tr
                      key={day.date}
                      className="border-b border-slate-100"
                    >

                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {day.date}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {day.total_transactions}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-emerald-600">
                        {day.successful_transactions}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-red-600">
                        {day.failed_transactions}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ₹
                        {Number(
                          day.total_success_amount || 0
                        ).toFixed(2)}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* =========================
            RECENT USERS
        ========================== */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Users
                </h2>

                <p className="text-xs text-slate-500">
                  Registered users in the system
                </p>
              </div>

            </div>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {users.slice(0, 10).map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100"
                  >

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                          <UserRound className="h-4 w-4 text-blue-600" />
                        </div>

                        <span className="text-sm font-medium text-slate-900">
                          {user.name}
                        </span>

                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_admin
                            ? "bg-blue-50 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.is_admin
                          ? "Admin"
                          : "Customer"}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          user.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {user.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;