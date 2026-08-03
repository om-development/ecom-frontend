"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/Redux/Api/userApi";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { setUser } from "@/Redux/authSlice";

const AdminLoginPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    try {
      const userData = await login({ email, password }).unwrap();
      if (userData.role === "admin") {
        dispatch(setUser(userData));
        router.push("/");
      } else {
        setError("Not authorized as admin");
      }
    } catch (err: unknown) {
      const message = (err as { data?: { message?: string } })?.data?.message;
      setError(message || "Invalid credentials");
    }
  };

  if (!loading && user) return null;

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl border border-neutral p-8">
        <h1 className="text-2xl font-bold text-secondary text-center mb-2">
          Admin Login
        </h1>
        <p className="text-secondary/60 text-sm text-center mb-6">
          Sign in as administrator
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-secondary text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral text-secondary placeholder-secondary/40 bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          <div>
            <label className="block text-secondary text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-lg border border-neutral text-secondary placeholder-secondary/40 bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-secondary text-accent font-semibold py-2.5 rounded-lg hover:bg-secondary/80 transition disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminLoginPage;