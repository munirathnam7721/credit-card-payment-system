import { useEffect, useState } from "react";
import { CreditCard, ShieldCheck } from "lucide-react";
import { getAdminCards } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCards = async () => {
      try {
        const data = await getAdminCards();
        setCards(data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.detail || "Unable to load cards."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading cards..." />;
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
            Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-950">
            Cards
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            View saved customer payment cards.
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
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Saved Cards
                </h2>

                <p className="text-xs text-slate-500">
                  {cards.length} cards found
                </p>
              </div>

            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Card
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Expiry
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Added
                  </th>

                </tr>
              </thead>

              <tbody>
                {cards.map((card) => (
                  <tr
                    key={card.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                          <CreditCard className="h-5 w-5 text-slate-600" />
                        </div>

                        <div>
                          <p className="font-mono text-sm font-semibold text-slate-900">
                            {card.masked_card}
                          </p>

                          <p className="text-xs text-slate-400">
                            Last 4: {card.last4}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {card.user_email || card.email || `User #${card.user}`}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {card.card_type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {String(card.expiry_month).padStart(2, "0")}/
                      {card.expiry_year}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(card.created_at).toLocaleDateString("en-IN")}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Card numbers are displayed only in masked form.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminCards;