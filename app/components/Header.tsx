"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCategoriesQuery } from "@/Redux/Api/productApi";
import { useLogoutMutation } from "@/Redux/Api/userApi";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { clearUser } from "@/Redux/authSlice";

const Header = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("q") || "");
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useGetCategoriesQuery();
  const [logout] = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: input.trim() || null });
  };

  const clearSearch = () => {
    setInput("");
    setSelectedCategory("");
    updateParams({ q: null, category: null });
  };

  const handleCategoryChange = (cat: string) => {
    setShowCategories(false);
    setSelectedCategory(cat);
    updateParams({ category: cat || null });
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // ignore network errors, still clear client state
    }
    dispatch(clearUser());
    router.push("/");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 bg-page-bg border-b border-neutral">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="text-secondary text-xl font-bold tracking-wide shrink-0">
          Store
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search From here"
              className="w-full px-4 py-1.5 rounded-lg text-sm text-secondary placeholder-secondary/40 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary"
            />
            {input && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary/50 text-sm"
              >
                &times;
              </button>
            )}
          </div>
        </form>

        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-surface text-secondary border border-neutral hover:ring-2 hover:ring-secondary transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clipRule="evenodd" />
            </svg>
            {selectedCategory || "Category"}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          {showCategories && (
            <div className="absolute top-full right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-surface border border-neutral rounded-xl shadow-xl p-3 z-50">
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-neutral transition text-sm">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={!selectedCategory}
                  onChange={() => handleCategoryChange("")}
                  className="accent-secondary"
                />
                <span className="text-secondary font-medium">All</span>
              </label>
              <hr className="my-1 border-neutral" />
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-neutral transition text-sm"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={selectedCategory === cat}
                    onChange={() => handleCategoryChange(cat)}
                    className="accent-secondary"
                  />
                  <span className="text-secondary capitalize">
                    {cat.replace(/-/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/admin"
              className="shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium border border-secondary text-secondary hover:bg-secondary hover:text-accent transition"
            >
              Admin Panel
            </Link>
            <span className="text-secondary text-sm hidden sm:inline font-semibold">
              Admin
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-secondary text-accent hover:bg-secondary/80 transition"
            >
              Logout
            </button>
          </div>
        ) : user ? (
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-secondary text-sm hidden sm:inline">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-secondary text-accent hover:bg-secondary/80 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium bg-secondary text-accent hover:bg-secondary/80 transition"
            >
              Login
            </Link>
            <Link
              href="/admin-login"
              className="shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium border border-secondary text-secondary hover:bg-secondary hover:text-accent transition"
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;