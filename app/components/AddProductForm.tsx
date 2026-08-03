"use client";

import { useState } from "react";
import { useAddProductMutation } from "@/Redux/Api/productApi";
import { useAppDispatch } from "@/Redux/hooks";
import { addAdminProduct } from "@/Redux/productSlice";

const AddProductForm = ({ onAddProduct }: { onAddProduct?: (p: unknown) => void }) => {
  const categories = ["Electronics", "Men", "Women", "Baby", "Home"];
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const dispatch = useAppDispatch();
  const [addProduct, { isLoading }] = useAddProductMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !title || !description || !price) return;

    try {
      const product = await addProduct({
        title,
        price: parseFloat(price),
        description,
        category,
        image,
      }).unwrap();
      dispatch(addAdminProduct(product));
      onAddProduct?.(product);
      setImage("");
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("Electronics");
    } catch (err) {
      console.error("Failed to add product", err);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="bg-surface rounded-2xl p-6 sm:p-8 shadow-xl border border-neutral">
        <h2 className="text-secondary text-xl sm:text-2xl font-semibold mb-6 text-center">
          Add Product
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-secondary text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Image Link Here "
                className="w-full px-4 py-2.5 rounded-lg border border-neutral text-secondary placeholder-secondary/40 bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-secondary text-sm font-medium mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral text-secondary placeholder-secondary/40 bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div>
              <label className="block text-secondary text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows={1}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral text-secondary placeholder-secondary/40 bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>
            <div>
              <label className="block text-secondary text-sm font-medium mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral text-secondary placeholder-secondary/40 bg-neutral focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <div className="lg:col-span-2 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-secondary text-sm font-medium mb-1">
                  Category
                </label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-1.5 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="accent-secondary"
                      />
                      <span className="text-secondary text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="shrink-0 bg-secondary text-accent font-semibold px-6 py-2.5 rounded-lg hover:bg-secondary/80 transition h-[42px] disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddProductForm;