"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "@/Redux/Api/productApi";
import { useAppSelector } from "@/Redux/hooks";

const Products = () => {
  const adminProducts = useAppSelector((state) => state.products.adminProducts);
  const { data: apiProducts = [], isLoading } = useGetProductsQuery();
  const [layout, setLayout] = useState<"vertical" | "horizontal">("vertical");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const category = searchParams.get("category") || "";

  const allProducts = useMemo(
    () => [...adminProducts, ...apiProducts],
    [adminProducts, apiProducts]
  );

  const filtered = useMemo(() => {
    let result = allProducts;
    if (query) {
      result = result.filter(
        (p) =>
          (p.title || p.name || "")
            .toLowerCase()
            .includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }
    if (category) {
      result = result.filter((p) => p.category === category);
    }
    return result;
  }, [allProducts, query, category]);

  const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, maxPage);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-bold text-secondary">Products</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout("vertical")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              layout === "vertical"
                ? "bg-secondary text-accent"
                : "bg-neutral text-secondary border border-neutral"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setLayout("horizontal")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              layout === "horizontal"
                ? "bg-secondary text-accent"
                : "bg-neutral text-secondary border border-neutral"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {isLoading && allProducts.length === 0 ? (
        <p className="text-center text-secondary/70 py-12 text-lg">
          Loading products...
        </p>
      ) : (
        <div
          className={
            layout === "vertical"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid grid-cols-1 gap-4"
          }
        >
          {paginated.length === 0 ? (
            <p className="col-span-full text-center text-secondary/70 py-12 text-lg">
              No products found for &quot;{query}&quot;.
            </p>
          ) : (
            paginated.map((product) => (
              <ProductCard key={product.id} product={product} layout={layout} />
            ))
          )}
        </div>
      )}

      {filtered.length > pageSize && (
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={safePage <= 1}
            className="px-6 py-2 rounded-lg font-medium bg-secondary text-accent disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/80 transition"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={safePage >= maxPage}
            className="px-6 py-2 rounded-lg font-medium bg-secondary text-accent disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary/80 transition"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default Products;