import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import { getAdminTransactions } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await getAdminTransactions();
        setTransactions(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail ||
            "Unable to load transactions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading transactions..." />;
  }

  const getStatus = (status) => {
    if (status === "SUCCESS") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Success
        </span>
      );
    }

    if (status === "FAILED") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
          <XCircle className="h-3.5 w-3.5" />
          Failed
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor all customer payment transactions.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  All Transactions
                </h2>

                <p className="text-xs text-slate-500">
                  {transactions.length} transactions found
                </p>
              </div>

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Transaction
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Card
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>

                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {transaction.transaction_reference}
                      </p>

                      <p className="text-xs text-slate-400">
                        ID #{transaction.id}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transaction.user_email ||
                        transaction.email ||
                        `User #${transaction.user}`}
                    </td>

                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                      {transaction.card_display ||
                        transaction.masked_card ||
                        "—"}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      ₹{Number(transaction.amount).toFixed(2)}
                    </td>

                    <td className="px-6 py-4">
                      {getStatus(transaction.status)}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(
                        transaction.created_at
                      ).toLocaleString("en-IN")}
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

export default AdminTransactions;