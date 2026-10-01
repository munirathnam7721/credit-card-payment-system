import { useEffect, useState } from "react";
import { CreditCard, IndianRupee, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { getCards } from "../services/cardService";
import { makePayment } from "../services/paymentService";
import LoadingSpinner from "../components/LoadingSpinner";

const Payment = () => {
  const [cards, setCards] = useState([]);
  const [cardId, setCardId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getCards();
        setCards(data);

        if (data.length > 0) {
          setCardId(String(data[0].id));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load your saved cards.");
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!cardId) {
      setError("Please select a card.");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    setProcessing(true);

    try {
      const response = await makePayment({
        card_id: Number(cardId),
        amount: Number(amount).toFixed(2),
      });

      setResult(response);
      setAmount("");
    } catch (err) {
      console.error(err);

      const message =
        err.response?.data?.detail ||
        "Payment could not be processed.";

      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading payment methods..." />;
  }

  return (
    <div className="min-h-full bg-slate-50 px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Secure Checkout
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Make Payment
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Make a secure payment using one of your saved cards.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Payment Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Payment Details
                </h2>

                <p className="text-sm text-slate-500">
                  Select a card and enter the payment amount.
                </p>
              </div>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <CreditCard className="mx-auto h-10 w-10 text-slate-400" />

                <h3 className="mt-4 font-semibold text-slate-900">
                  No saved cards
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Please add a card before making a payment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Card */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Card
                  </label>

                  <select
                    value={cardId}
                    onChange={(event) => setCardId(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                  >
                    {cards.map((card) => (
                      <option key={card.id} value={card.id}>
                        {card.card_type} •••• {card.last4}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Payment Amount
                  </label>

                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-lg font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div
                    className={`rounded-xl border p-4 ${
                      result.status === "SUCCESS"
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {result.status === "SUCCESS" ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}

                      <div>
                        <p
                          className={`font-semibold ${
                            result.status === "SUCCESS"
                              ? "text-emerald-800"
                              : "text-red-800"
                          }`}
                        >
                          {result.message}
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Reference: {result.transaction_reference}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {processing ? "Processing Payment..." : "Pay Now"}
                </button>

              </form>
            )}
          </div>

          {/* Security Panel */}
          <div className="space-y-5">

            <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                <ShieldCheck className="h-6 w-6 text-blue-400" />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                Secure Payment
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your saved card details are protected. Full card numbers
                and CVV values are never stored in the database.
              </p>

              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  JWT authenticated
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Card ownership verified
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Transaction recorded
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Payment Flow
              </p>

              <div className="mt-4 space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                    1
                  </span>
                  <p className="pt-1 text-slate-600">
                    Select your saved card.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                    2
                  </span>
                  <p className="pt-1 text-slate-600">
                    Enter the payment amount.
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-600">
                    3
                  </span>
                  <p className="pt-1 text-slate-600">
                    Payment is processed securely.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;