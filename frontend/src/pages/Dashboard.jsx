import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Plus,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getCards } from "../services/cardService";
import { getTransactions } from "../services/transactionService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";


const Dashboard = () => {
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [cardsData, transactionsData] =
          await Promise.all([
            getCards(),
            getTransactions(),
          ]);

        setCards(cardsData);
        setTransactions(transactionsData);

      } catch (error) {
        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);


  const statistics = useMemo(() => {

    const successfulTransactions =
      transactions.filter(
        (transaction) =>
          transaction.status === "SUCCESS"
      );

    const totalSpent =
      successfulTransactions.reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    return {
      cardCount: cards.length,
      totalPayments: transactions.length,
      successfulPayments:
        successfulTransactions.length,
      totalSpent,
    };

  }, [cards, transactions]);


  const recentTransactions =
    transactions.slice(0, 5);


  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }


  return (
    <div className="mx-auto max-w-7xl">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm font-medium text-blue-600">
            Payment Overview
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back, {user?.name || "User"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's an overview of your payment activity.
          </p>

        </div>


        <Link
          to="/payment"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          Make Payment
        </Link>

      </div>


      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* Statistics */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {/* Cards */}
        <StatCard
          title="Available Cards"
          value={statistics.cardCount}
          icon={CreditCard}
          iconClass="bg-blue-50 text-blue-600"
        />


        {/* Payments */}
        <StatCard
          title="Total Payments"
          value={statistics.totalPayments}
          icon={Receipt}
          iconClass="bg-violet-50 text-violet-600"
        />


        {/* Successful */}
        <StatCard
          title="Successful"
          value={statistics.successfulPayments}
          icon={TrendingUp}
          iconClass="bg-emerald-50 text-emerald-600"
        />


        {/* Spent */}
        <StatCard
          title="Total Spent"
          value={`₹${statistics.totalSpent.toFixed(2)}`}
          icon={DollarSign}
          iconClass="bg-amber-50 text-amber-600"
        />

      </div>


      {/* Main Grid */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">


        {/* Recent Transactions */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

            <div>

              <h2 className="font-semibold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Your latest payment activity
              </p>

            </div>


            <Link
              to="/transactions"
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>


          {recentTransactions.length === 0 ? (

            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                <Receipt className="h-6 w-6 text-slate-400" />
              </div>

              <p className="mt-4 font-medium text-slate-900">
                No transactions yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Your payment activity will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {recentTransactions.map(
                (transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
                )
              )}

            </div>

          )}

        </div>


        {/* Cards Preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="font-semibold text-slate-900">
                My Cards
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Saved payment cards
              </p>

            </div>


            <Link
              to="/cards"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage
            </Link>

          </div>


          <div className="mt-5 space-y-4">

            {cards.length === 0 ? (

              <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">

                <CreditCard className="mx-auto h-7 w-7 text-slate-400" />

                <p className="mt-3 text-sm font-medium text-slate-700">
                  No saved cards
                </p>

                <Link
                  to="/cards"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                >
                  Add a card
                  <ArrowRight className="h-4 w-4" />
                </Link>

              </div>

            ) : (

              cards.slice(0, 3).map(
                (card) => (
                  <CardPreview
                    key={card.id}
                    card={card}
                  />
                )
              )

            )}

          </div>

        </div>

      </div>


      {/* Quick Actions */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5">

          <h2 className="font-semibold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Common payment tasks
          </p>

        </div>


        <div className="grid gap-4 sm:grid-cols-3">

          <QuickAction
            to="/cards"
            icon={CreditCard}
            title="Manage Cards"
            description="Add or remove cards"
          />

          <QuickAction
            to="/payment"
            icon={DollarSign}
            title="Make Payment"
            description="Pay using a saved card"
          />

          <QuickAction
            to="/transactions"
            icon={Receipt}
            title="View Transactions"
            description="Review payment history"
          />

        </div>

      </div>

    </div>
  );
};


const StatCard = ({
  title,
  value,
  icon: Icon,
  iconClass,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>

        </div>


        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>

      </div>

    </div>
  );
};


const TransactionRow = ({
  transaction,
}) => {

  const isSuccess =
    transaction.status === "SUCCESS";

  const isFailed =
    transaction.status === "FAILED";


  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">

      <div className="flex min-w-0 items-center gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isSuccess
              ? "bg-emerald-50 text-emerald-600"
              : isFailed
              ? "bg-red-50 text-red-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >

          {isSuccess ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : isFailed ? (
            <ArrowDownRight className="h-5 w-5" />
          ) : (
            <Receipt className="h-5 w-5" />
          )}

        </div>


        <div className="min-w-0">

          <p className="truncate text-sm font-semibold text-slate-900">
            {transaction.transaction_reference}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {transaction.card_display}
          </p>

        </div>

      </div>


      <div className="shrink-0 text-right">

        <p className="text-sm font-semibold text-slate-900">
          ₹{Number(transaction.amount).toFixed(2)}
        </p>

        <span
          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isSuccess
              ? "bg-emerald-50 text-emerald-700"
              : isFailed
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {transaction.status}
        </span>

      </div>

    </div>
  );
};


const CardPreview = ({
  card,
}) => {

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 text-white shadow-lg">

      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-600/20" />

      <div className="relative">

        <div className="flex items-center justify-between">

          <CreditCard className="h-6 w-6" />

          <span className="text-xs font-medium text-slate-400">
            {card.card_type}
          </span>

        </div>


        <p className="mt-7 text-lg font-medium tracking-[0.2em]">
          {card.masked_card}
        </p>


        <div className="mt-5 flex items-end justify-between">

          <div>

            <p className="text-[10px] uppercase text-slate-500">
              Valid thru
            </p>

            <p className="mt-1 text-sm">
              {String(card.expiry_month).padStart(2, "0")}/
              {String(card.expiry_year).slice(-2)}
            </p>

          </div>


          <div className="text-right">

            <p className="text-[10px] uppercase text-slate-500">
              Card
            </p>

            <p className="mt-1 text-sm font-semibold">
              •••• {card.last4}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};


const QuickAction = ({
  to,
  icon: Icon,
  title,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50/50"
    >

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>

        <div>

          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </Link>
  );
};


export default Dashboard;