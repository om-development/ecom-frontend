"use client";

import Link from "next/link";
import { useGetProductByIdQuery } from "@/Redux/Api/productApi";

const ProductDetail = ({ id }: { id: string }) => {
  const { data: product, isLoading, isError } = useGetProductByIdQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center flex-1 py-32">
        <p className="text-xl text-secondary">Loading...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center flex-1 py-32">
        <p className="text-xl text-secondary">Product not found</p>
      </div>
    );
  }

  const title = product.title || product.name || "";

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full">
      <Link
        href="/"
        className="text-secondary font-medium hover:text-secondary/80 mb-6 inline-block transition"
      >
        &larr; Back to Products
      </Link>
      <div className="bg-surface rounded-2xl shadow-xl border border-neutral overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img
              src={product.image}
              alt={title}
              className="w-full h-80 md:h-full object-cover"
            />
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary">
              {title}
            </h1>
            <p className="text-secondary text-3xl font-bold mt-3">
              ${product.price}
            </p>
            <p className="text-secondary/70 mt-4 leading-relaxed">
              {product.description}
            </p>
            {product.brand && (
              <p className="mt-4 text-sm text-secondary/70">
                <span className="font-semibold text-secondary">Brand:</span>{" "}
                {product.brand}
              </p>
            )}
            {product.category && (
              <p className="mt-1 text-sm text-secondary/70">
                <span className="font-semibold text-secondary">Category:</span>{" "}
                {product.category}
              </p>
            )}
            {product.rating && (
              <p className="mt-1 text-sm text-secondary/70">
                <span className="font-semibold text-secondary">Rating:</span>{" "}
                {product.rating} / 5
              </p>
            )}
            {product.stock && (
              <p className="mt-1 text-sm text-secondary/70">
                <span className="font-semibold text-secondary">Stock:</span>{" "}
                {product.stock} units
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;