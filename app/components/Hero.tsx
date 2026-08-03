"use client";

import { useAppSelector } from "@/Redux/hooks";

const Hero = () => {
  const user = useAppSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const name = isAdmin ? "Admin" : user?.name || "User";

  return (
    <section className="flex items-center justify-center px-4 py-16 md:py-24">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-secondary">
          Welcome, {name}!
        </h1>
        <p className="mt-4 text-base sm:text-lg text-secondary/50 max-w-lg mx-auto">
          Built by Om Dhakal
        </p>
      </div>
    </section>
  );
};

export default Hero;