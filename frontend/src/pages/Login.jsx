import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, LockKeyhole, Mail } from "lucide-react";

import { useAuth } from "../context/AuthContext";


const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
      await login(formData);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.detail ||
        "Invalid email or password.";

      setError(message);
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
            <CreditCard
              className="h-7 w-7 text-white"
            />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            CardPay
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Secure credit card payment system
          </p>

        </div>


        {/* Login Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-7">
            <h2 className="text-2xl font-semibold text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Sign in to manage your cards and payments.
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

            {/* Email */}
            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email address
              </label>

              <div className="relative">

                <Mail
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                />

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

                <LockKeyhole
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>


          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-400">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              Create account
            </Link>

          </p>

        </div>


        <p className="mt-6 text-center text-xs text-slate-500">
          Your payment information is protected with secure authentication.
        </p>

      </div>

    </div>
  );
};

export default Login;