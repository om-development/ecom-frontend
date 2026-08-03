import { Suspense } from "react";
import Hero from "./components/Hero";
import Products from "./components/Products";

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense>
        <Products />
      </Suspense>
    </>
  );
}