
import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  ShieldCheck,
  Search,
  RefreshCw,
  Ban,
  CheckCircle,
  Pencil,
  X,
  Save,
  AlertCircle,
} from "lucide-react";

import {
  getAdminCards,
  updateAdminCardStatus,
  updateAdminCardLimit,
} from "../services/adminService";

import LoadingSpinner from "../components/LoadingSpinner";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getErrorMessage = (error, fallback) => {
  const data = error.response?.data;

  if (typeof data?.detail === "string") return data.detail;
  if (typeof data?.credit_limit?.[0] === "string") {
    return data.credit_limit[0];
  }
  if (typeof data?.is_blocked?.[0] === "string") {
    return data.is_blocked[0];
  }

  return fallback;
};

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingCardId, setEditingCardId] = useState(null);
  const [creditLimitInput, setCreditLimitInput] = useState("");
  const [savingCardId, setSavingCardId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const loadCards = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const data = await getAdminCards();
      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load admin cards:", err);
      setError(getErrorMessage(err, "Unable to load cards."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase();

    return cards.filter((card) => {
      const matchesSearch = [
        card.masked_card,
        card.last4,
        card.user_email,
        card.email,
        card.card_type,
        String(card.user ?? ""),
        String(card.id),
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "blocked" && card.is_blocked) ||
        (statusFilter === "active" && !card.is_blocked);

      return matchesSearch && matchesStatus;
    });
  }, [cards, search, statusFilter]);

  const startEditing = (card) => {
    setEditingCardId(card.id);
    setCreditLimitInput(String(card.credit_limit ?? ""));
    setError("");
    setNotice("");
  };

  const cancelEditing = () => {
    setEditingCardId(null);
    setCreditLimitInput("");
  };

  const handleStatusChange = async (card) => {
    const nextBlockedStatus = !card.is_blocked;
    const action = nextBlockedStatus ? "block" : "unblock";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} card ${card.masked_card}?`
    );

    if (!confirmed) return;

    setUpdatingStatusId(card.id);
    setError("");
    setNotice("");

    try {
      const result = await updateAdminCardStatus(
        card.id,
        nextBlockedStatus
      );

      setCards((previousCards) =>
        previousCards.map((item) =>
          item.id === card.id
            ? { ...item, is_blocked: result.is_blocked }
            : item
        )
      );

      setNotice(
        result.message ||
          (nextBlockedStatus
            ? "Card blocked successfully."
            : "Card unblocked successfully.")
      );
    } catch (err) {
      console.error("Unable to update card status:", err);
      setError(
        getErrorMessage(err, "Unable to update card status.")
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleCreditLimitSave = async (card) => {
    const normalizedLimit = creditLimitInput.trim();
    const limit = Number(normalizedLimit);

    if (
      normalizedLimit === "" ||
      !Number.isFinite(limit) ||
      limit <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(normalizedLimit) ||
      limit >= 10000000000
    ) {
      setError(
        "Enter a valid credit limit greater than ₹0, below ₹10,00,00,00,000, with at most 2 decimal places."
      );
      return;
    }

    setSavingCardId(card.id);
    setError("");
    setNotice("");

    try {
      const result = await updateAdminCardLimit(
        card.id,
        normalizedLimit
      );

      setCards((previousCards) =>
        previousCards.map((item) =>
          item.id === card.id
            ? {
                ...item,
                credit_limit: result.credit_limit,
              }
            : item
        )
      );

      setNotice(
        result.message || "Credit limit updated successfully."
      );

      cancelEditing();
    } catch (err) {
      console.error("Unable to update credit limit:", err);
      setError(
        getErrorMessage(err, "Unable to update credit limit.")
      );
    } finally {
      setSavingCardId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading cards..." />;
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Administration
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Card Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage customer cards, card status, and credit limits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadCards(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Cards
          </button>
        </div>

        {/* Feedback messages */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total Cards</p>
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-950">
              {cards.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Active Cards</p>
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-700">
              {cards.filter((card) => !card.is_blocked).length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Blocked Cards</p>
              <Ban className="h-5 w-5 text-red-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-red-700">
              {cards.filter((card) => card.is_blocked).length}
            </p>
          </div>
        </div>

        {/* Main card management table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Customer Cards
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing {filteredCards.length} of {cards.length} cards
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    aria-label="Search cards"
                    placeholder="Search email or card..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
                  />
                </div>

                <select
                  aria-label="Filter cards by status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {[
                    "Card",
                    "Customer",
                    "Type",
                    "Expiry",
                    "Credit Limit",
                    "Status",
                    "Added",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredCards.map((card) => {
                  const isEditing = editingCardId === card.id;
                  const isSaving = savingCardId === card.id;
                  const isUpdatingStatus = updatingStatusId === card.id;

                  return (
                    <tr
                      key={card.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                            <CreditCard className="h-5 w-5 text-slate-600" />
                          </div>

                          <div>
                            <p className="font-mono text-sm font-semibold text-slate-900">
                              {card.masked_card || `•••• ${card.last4}`}
                            </p>
                            <p className="text-xs text-slate-400">
                              Last 4: {card.last4 || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {card.user_email ||
                          card.email ||
                          `User #${card.user ?? "—"}`}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {card.card_type || "—"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {String(card.expiry_month ?? "—").padStart(2, "0")}/
                        {card.expiry_year ?? "—"}
                      </td>

                      <td className="px-5 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            min="0.01"
                            max="9999999999.99"
                            step="0.01"
                            aria-label={`New credit limit for card ${card.id}`}
                            value={creditLimitInput}
                            onChange={(event) =>
                              setCreditLimitInput(event.target.value)
                            }
                            className="w-36 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        ) : (
                          <span className="whitespace-nowrap text-sm font-semibold text-slate-800">
                            {formatCurrency(card.credit_limit)}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            card.is_blocked
                              ? "bg-red-50 text-red-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              card.is_blocked
                                ? "bg-red-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          {card.is_blocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {card.created_at &&
                        !Number.isNaN(Date.parse(card.created_at))
                          ? new Date(card.created_at).toLocaleDateString(
                              "en-IN"
                            )
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleCreditLimitSave(card)}
                                disabled={isSaving || isUpdatingStatus}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Save className="h-3.5 w-3.5" />
                                {isSaving ? "Saving..." : "Save"}
                              </button>

                              <button
                                type="button"
                                onClick={cancelEditing}
                                disabled={isSaving}
                                aria-label="Cancel credit limit edit"
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-60"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(card)}
                                disabled={isUpdatingStatus || savingCardId !== null}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                                Limit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(card)}
                                disabled={isUpdatingStatus || savingCardId !== null}
                                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                  card.is_blocked
                                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-red-50 text-red-700 hover:bg-red-100"
                                }`}
                              >
                                {card.is_blocked ? (
                                  <CheckCircle className="h-3.5 w-3.5" />
                                ) : (
                                  <Ban className="h-3.5 w-3.5" />
                                )}
                                {isUpdatingStatus
                                  ? "Updating..."
                                  : card.is_blocked
                                    ? "Unblock"
                                    : "Block"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredCards.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-14 text-center"
                    >
                      <Search className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 font-semibold text-slate-700">
                        No cards found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <p>
                Card numbers are displayed only in masked form. Card
                management actions are restricted by the backend to
                authorized administrators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCards;