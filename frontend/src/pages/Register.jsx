import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(formData);

      navigate("/login", {
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      console.error(error);

      const responseData = error.response?.data;

      if (responseData?.email) {
        setError(responseData.email[0]);
      } else if (responseData?.password) {
        setError(responseData.password[0]);
      } else if (responseData?.name) {
        setError(responseData.name[0]);
      } else {
        setError(
          responseData?.detail ||
            "Unable to create your account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <CreditCard className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            CardPay
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create your secure payment account
          </p>

        </div>

        {/* Register Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-white">
              Create account
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Get started with secure card payments.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Full name
              </label>

              <div className="relative">

                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-slate-400">

            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign in
            </Link>

          </p>

        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Passwords are securely hashed by the backend.
        </p>

      </div>

    </div>
  );
};

export default Register;