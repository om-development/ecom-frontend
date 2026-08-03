"use client";

import { useState } from "react";
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";
import { useAppSelector } from "@/Redux/hooks";

function AdminPage() {
  const adminProducts = useAppSelector((state) => state.products.adminProducts);
  const [success, setSuccess] = useState("");

  const handleAddProduct = (product: unknown) => {
    setSuccess(`"${(product as { title?: string })?.title}" added successfully!`);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary text-center mb-10">
        Admin Panel — Add Product
      </h1>

      {success && (
        <p className="text-green-400 text-sm text-center mb-6">{success}</p>
      )}

      <AddProductForm onAddProduct={handleAddProduct} />

      {adminProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-secondary mb-4">
            Recently Added
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminProducts.map((p) => (
              <ProductCard key={p.id} product={p} layout="vertical" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;