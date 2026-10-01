import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  History,
  IndianRupee,
  XCircle,
} from "lucide-react";

import { getTransactions } from "../services/transactionService";
import LoadingSpinner from "../components/LoadingSpinner";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Filters
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      // Status filter
      if (status) {
        params.status = status;
      }

      // Date filter
      if (date) {
        params.date = date;
      }

      // Minimum amount filter
      if (minAmount) {
        params.min_amount = minAmount;
      }

      // Maximum amount filter
      if (maxAmount) {
        params.max_amount = maxAmount;
      }

      const data = await getTransactions(params);

      setTransactions(data);
    } catch (err) {
      console.error("Unable to load transactions:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load your transaction history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [status, date, minAmount, maxAmount]);

  // Status UI configuration
  const getStatusConfig = (transactionStatus) => {
    switch (transactionStatus) {
      case "SUCCESS":
        return {
          label: "Success",
          className: "bg-emerald-50 text-emerald-700",
          icon: CheckCircle2,
        };

      case "FAILED":
        return {
          label: "Failed",
          className: "bg-red-50 text-red-700",
          icon: XCircle,
        };

      case "PENDING":
        return {
          label: "Pending",
          className: "bg-amber-50 text-amber-700",
          icon: Clock3,
        };

      default:
        return {
          label: transactionStatus,
          className: "bg-slate-100 text-slate-600",
          icon: Clock3,
        };
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStatus("");
    setDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  const hasFilters =
    status || date || minAmount || maxAmount;

  if (loading) {
    return <LoadingSpinner text="Loading transactions..." />;
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Payment Activity
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View and filter your complete payment history.
          </p>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Filter Header */}
          <div className="border-b border-slate-200 p-5">

            <div className="flex flex-col gap-5">

              {/* Filter Title */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Filter className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Filter Transactions
                  </p>

                  <p className="text-xs text-slate-500">
                    Narrow your payment history
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                {/* Status */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Status
                  </label>

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">All statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      value={date}
                      onChange={(event) =>
                        setDate(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* Minimum Amount */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Minimum Amount
                  </label>

                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={minAmount}
                      onChange={(event) =>
                        setMinAmount(event.target.value)
                      }
                      placeholder="Min amount"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* Maximum Amount */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500">
                    Maximum Amount
                  </label>

                  <div className="relative">
                    <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={maxAmount}
                      onChange={(event) =>
                        setMaxAmount(event.target.value)
                      }
                      placeholder="Max amount"
                      className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    disabled={!hasFilters}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Results Count */}
          {!error && transactions.length > 0 && (
            <div className="border-b border-slate-100 px-5 py-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {transactions.length}
                </span>{" "}
                transaction
                {transactions.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}

          {/* No Transactions */}
          {transactions.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <History className="h-8 w-8 text-slate-400" />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-slate-900">
                No transactions found
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                No transactions match your current filters.
                Try clearing the filters or make a new payment.
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Transaction
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Card
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Date
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Amount
                      </th>

                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Status
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {transactions.map((transaction) => {
                      const statusConfig = getStatusConfig(
                        transaction.status
                      );

                      const StatusIcon = statusConfig.icon;

                      return (
                        <tr
                          key={transaction.id}
                          className="border-b border-slate-100 transition hover:bg-slate-50"
                        >

                          {/* Transaction */}
                          <td className="px-6 py-5">
                            <p className="font-semibold text-slate-900">
                              {transaction.transaction_reference}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID #{transaction.id}
                            </p>
                          </td>

                          {/* Card */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                <CreditCardIcon />
                              </div>

                              <span className="text-sm font-medium text-slate-700">
                                {transaction.card_display}
                              </span>

                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-5">
                            <p className="text-sm text-slate-700">
                              {new Date(
                                transaction.created_at
                              ).toLocaleDateString("en-IN")}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {new Date(
                                transaction.created_at
                              ).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </td>

                          {/* Amount */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-1 font-semibold text-slate-900">
                              <IndianRupee className="h-4 w-4" />

                              {Number(transaction.amount).toFixed(2)}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${statusConfig.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />

                              {statusConfig.label}
                            </span>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Transaction Cards */}
              <div className="space-y-4 p-4 lg:hidden">

                {transactions.map((transaction) => {
                  const statusConfig = getStatusConfig(
                    transaction.status
                  );

                  const StatusIcon = statusConfig.icon;

                  return (
                    <div
                      key={transaction.id}
                      className="rounded-xl border border-slate-200 p-4"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="font-semibold text-slate-900">
                            {transaction.transaction_reference}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {transaction.card_display}
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />

                          {statusConfig.label}
                        </span>

                      </div>

                      <div className="mt-4 flex items-end justify-between">

                        <div>
                          <p className="text-xs text-slate-400">
                            Date
                          </p>

                          <p className="mt-1 text-sm text-slate-700">
                            {new Date(
                              transaction.created_at
                            ).toLocaleDateString("en-IN")}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {new Date(
                              transaction.created_at
                            ).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        <p className="text-lg font-bold text-slate-950">
                          ₹{Number(transaction.amount).toFixed(2)}
                        </p>

                      </div>
                    </div>
                  );
                })}

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CreditCardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className="h-5 w-5 text-slate-500"
  >
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
    />

    <path d="M3 10h18" />

    <path d="M7 15h4" />
  </svg>
);

export default Transactions;