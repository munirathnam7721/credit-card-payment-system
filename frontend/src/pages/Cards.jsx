import { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  addCard,
  deleteCard,
  getCards,
} from "../services/cardService";

import LoadingSpinner from "../components/LoadingSpinner";


const Cards = () => {
  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showAddCard, setShowAddCard] = useState(false);

  const [form, setForm] = useState({
    card_type: "CREDIT",
    card_number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
  });


  const loadCards = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCards();

      setCards(data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to load cards."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadCards();
  }, []);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      form.card_number.length < 13 ||
      form.card_number.length > 19
    ) {
      setError(
        "Card number must contain between 13 and 19 digits."
      );

      return;
    }

    if (!/^\d+$/.test(form.card_number)) {
      setError("Card number must contain digits only.");
      return;
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      setError("CVV must contain 3 or 4 digits.");
      return;
    }

    if (
      !form.expiry_month ||
      !form.expiry_year
    ) {
      setError("Please enter the card expiry date.");
      return;
    }


    try {
      setSubmitting(true);

      await addCard({
        card_type: form.card_type,
        card_number: form.card_number,
        cvv: form.cvv,
        expiry_month: Number(form.expiry_month),
        expiry_year: Number(form.expiry_year),
      });


      setSuccess("Card added successfully.");

      setForm({
        card_type: "CREDIT",
        card_number: "",
        cvv: "",
        expiry_month: "",
        expiry_year: "",
      });

      setShowAddCard(false);

      await loadCards();

    } catch (err) {
      console.error(err);

      const data = err.response?.data;

      setError(
        data?.detail ||
        data?.card_number?.[0] ||
        data?.cvv?.[0] ||
        "Unable to add card."
      );

    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async (cardId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this card?"
    );

    if (!confirmed) {
      return;
    }


    try {
      setError("");
      setSuccess("");

      await deleteCard(cardId);

      setCards((previous) =>
        previous.filter(
          (card) => card.id !== cardId
        )
      );

      setSuccess("Card deleted successfully.");

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Unable to delete card."
      );
    }
  };


  if (loading) {
    return (
      <LoadingSpinner text="Loading your cards..." />
    );
  }


  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>

          <p className="text-sm font-medium text-blue-600">
            Payment Methods
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Cards
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your saved credit and debit cards.
          </p>

        </div>


        <button
          onClick={() => {
            setError("");
            setSuccess("");
            setShowAddCard(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
        >
          <Plus className="h-5 w-5" />
          Add Card
        </button>

      </div>


      {/* Messages */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}


      {/* Cards */}
      {cards.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
            <CreditCard className="h-7 w-7 text-blue-600" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            No cards saved
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Add your first credit or debit card to start making payments.
          </p>

          <button
            onClick={() => setShowAddCard(true)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Add Your First Card
          </button>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2">

          {cards.map((card) => (

            <CardItem
              key={card.id}
              card={card}
              onDelete={handleDelete}
            />

          ))}

        </div>

      )}


      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Add New Card
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Your full card number is not stored.
                </p>

              </div>


              <button
                onClick={() => setShowAddCard(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>


            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Card Type */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Card Type
                </label>

                <select
                  name="card_type"
                  value={form.card_type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >

                  <option value="CREDIT">
                    Credit Card
                  </option>

                  <option value="DEBIT">
                    Debit Card
                  </option>

                </select>

              </div>


              {/* Card Number */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Card Number
                </label>

                <input
                  type="text"
                  name="card_number"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength="19"
                  value={form.card_number}
                  onChange={handleChange}
                  placeholder="1234567890123456"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm tracking-wider outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>


              {/* CVV */}
              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  CVV
                </label>

                <input
                  type="password"
                  name="cvv"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength="4"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="•••"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>


              {/* Expiry */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Expiry Month
                  </label>

                  <select
                    name="expiry_month"
                    value={form.expiry_month}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    <option value="">
                      Month
                    </option>

                    {Array.from(
                      { length: 12 },
                      (_, index) => index + 1
                    ).map((month) => (
                      <option
                        key={month}
                        value={month}
                      >
                        {String(month).padStart(2, "0")}
                      </option>
                    ))}

                  </select>

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Expiry Year
                  </label>

                  <select
                    name="expiry_year"
                    value={form.expiry_year}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >

                    <option value="">
                      Year
                    </option>

                    {Array.from(
                      { length: 10 },
                      (_, index) =>
                        new Date().getFullYear() + index
                    ).map((year) => (
                      <option
                        key={year}
                        value={year}
                      >
                        {year}
                      </option>
                    ))}

                  </select>

                </div>

              </div>


              {/* Security message */}
              <div className="rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                We only retain the masked card number and last four digits.
                CVV is never stored.
              </div>


              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Adding Card..."
                  : "Add Card"}
              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};


const CardItem = ({
  card,
  onDelete,
}) => {

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Visual card */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-6 text-white shadow-lg">

        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-600/30" />

        <div className="relative">

          <div className="flex items-center justify-between">

            <CreditCard className="h-7 w-7" />

            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              {card.card_type}
            </span>

          </div>


          <p className="mt-10 text-xl tracking-[0.18em]">
            {card.masked_card}
          </p>


          <div className="mt-8 flex justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Valid Thru
              </p>

              <p className="mt-1 text-sm">
                {String(card.expiry_month).padStart(2, "0")}/
                {String(card.expiry_year).slice(-2)}
              </p>

            </div>


            <div className="text-right">

              <p className="text-[10px] uppercase tracking-wider text-slate-500">
                Card
              </p>

              <p className="mt-1 text-sm font-semibold">
                •••• {card.last4}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* Card info */}
      <div className="flex items-center justify-between pt-5">

        <div>

          <p className="text-sm font-semibold text-slate-900">
            {card.card_type === "CREDIT"
              ? "Credit Card"
              : "Debit Card"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Added {new Date(card.created_at).toLocaleDateString()}
          </p>

        </div>


        <button
          onClick={() => onDelete(card.id)}
          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
          title="Delete card"
        >
          <Trash2 className="h-5 w-5" />
        </button>

      </div>

    </div>
  );
};


export default Cards;