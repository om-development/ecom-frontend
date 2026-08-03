import Link from "next/link";
import type { Product } from "@/Types/product";

interface ProductCardProps {
  product: Product;
  layout?: "vertical" | "horizontal";
}

const ProductCard = ({ product, layout = "vertical" }: ProductCardProps) => {
  const imgSrc = product.image || product.thumbnail || "";
  const title = product.title || product.name || "";
  const price = product.price;

  const card =
    layout === "horizontal" ? (
      <div className="flex items-center gap-6 bg-surface rounded-xl shadow-md p-5 border border-neutral w-full">
        <img
          src={imgSrc}
          alt={title}
          className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-secondary">{title}</h3>
          <p className="text-secondary/70 mt-1 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
          <p className="text-secondary font-bold text-2xl mt-2">${price}</p>
        </div>
      </div>
    ) : (
      <div className="bg-surface rounded-xl shadow-md border border-neutral overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-52 object-cover"
        />
        <div className="p-5">
          <h3 className="text-xl font-semibold text-secondary">{title}</h3>
          <p className="text-secondary font-bold text-2xl mt-1">${price}</p>
          <p className="text-secondary/70 mt-2 text-sm leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    );

  return (
    <Link
      href={`/product/${product.id}`}
      className="block hover:ring-2 hover:ring-secondary hover:rounded-xl transition-all"
    >
      {card}
    </Link>
  );
};

export default ProductCard;