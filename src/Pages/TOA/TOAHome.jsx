
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TOAHome = () => {
  const [selectedLogin, setSelectedLogin] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const handleLogin = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    const isAdmin = selectedLogin === "admin";

    const loginUrl = isAdmin
  ? "/api/toa/admin/login"
  : "/api/toa/tp/login";

    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.token) {
        setErrorMessage(
          data.message || "Login failed. Please check your credentials."
        );
        return;
      }

      if (isAdmin) {
        localStorage.setItem("toa_admin_token", data.token);
        localStorage.setItem(
          "toa_admin_user",
          JSON.stringify(data.user || { username: username.trim(), role: "ADMIN" })
        );

        navigate("/toa/admin-dashboard");
      } else {
        localStorage.setItem("toa_tp_token", data.token);
        localStorage.setItem(
          "toa_tp_user",
          JSON.stringify(data.user)
        );

        navigate("/toa/tp-dashboard");
      }
    } catch (error) {
      console.error("TOA login error:", error);

      setErrorMessage(
        "Unable to connect to the TOA server. Please ensure the backend is running on port 5001."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 px-6 py-8 text-center text-white">
          <h1 className="text-3xl font-bold">TOA Portal</h1>
          <p className="mt-2 text-indigo-100">
            Training Organisation / Awarding Body Portal
          </p>
        </div>

        <div className="p-6 sm:p-10">
          {!selectedLogin ? (
            <>
              <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
                Welcome to TOA
              </h2>

              <p className="mb-8 text-center text-gray-500">
                Select your login type to continue.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLogin("admin");
                    setErrorMessage("");
                  }}
                  className="rounded-xl border-2 border-gray-200 p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <div className="mb-4 text-4xl">🔐</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Admin Login
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Login for authorized administrators
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedLogin("tp");
                    setErrorMessage("");
                  }}
                  className="rounded-xl border-2 border-gray-200 p-8 text-center transition hover:border-indigo-500 hover:bg-indigo-50"
                >
                  <div className="mb-4 text-4xl">👥</div>
                  <h3 className="text-xl font-bold text-gray-800">
                    TP Login
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Login for authorized Training Partner
                  </p>
                </button>
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-md">
              <h2 className="mb-2 text-center text-2xl font-bold text-indigo-700">
                {selectedLogin === "admin"
                  ? "TOA Admin Login"
                  : "TP Login"}
              </h2>

              <p className="mb-6 text-center text-gray-500">
                Enter your credentials to continue.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  className={inputClass}
                  type="text"
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />

                <input
                  className={inputClass}
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                {errorMessage && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Logging in..."
                    : selectedLogin === "admin"
                    ? "Admin Login"
                    : "Login"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setSelectedLogin("");
                  setUsername("");
                  setPassword("");
                  setErrorMessage("");
                }}
                className="mt-5 block w-full text-center text-gray-600 hover:underline"
              >
                ← Back to TOA Login Options
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/portal")}
            className="mt-8 block w-full text-center text-sm text-gray-500 hover:text-indigo-600"
          >
            Return to Main Portal
          </button>
        </div>
      </div>
    </div>
  );
};

export default TOAHome;
