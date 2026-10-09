import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { products } from "../data/demo";
import { useCartStore } from "../store/cart";
import type { Product } from "../types";
import { formatCurrency, getDiscountPercent } from "../lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [justAdded, setJustAdded] = useState(false);

  const discount = getDiscountPercent(
    product.referencePrice,
    product.unitPrice,
  );

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_12px_30px_-24px_rgba(23,33,28,0.2)] transition hover:-translate-y-0.5 hover:border-[color:var(--color-primary)] hover:shadow-[0_18px_34px_-24px_rgba(19,134,91,0.35)]"
      aria-label={`View product page for ${product.name}`}
    >
      <div className="relative bg-[#f4f7f5]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-52 w-full object-contain p-3 transition duration-200 group-hover:scale-[1.03]"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#0b7a5b] px-2 py-1 text-[10px] font-semibold text-white">
            {discount}% OFF
          </span>
        )}
        {product.requiresPrescription && (
          <span className="absolute bottom-3 right-3 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
            Rx required
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between text-[12px] text-[color:var(--color-text-secondary)]">
          <span>
            {products.find((item) => item.brandId === product.brandId)?.name ??
              "Trusted brand"}
          </span>
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div>
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[15px] font-semibold leading-5 text-[color:var(--color-text)]">
            {product.name}
          </h3>
          <p className="mt-1 text-[12px] text-[color:var(--color-text-secondary)]">
            {product.packageSize}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <span className="text-[18px] font-bold text-[color:var(--color-primary)]">
            {formatCurrency(product.unitPrice)}
          </span>
          {product.referencePrice && (
            <span className="text-[12px] text-slate-400 line-through">
              {formatCurrency(product.referencePrice)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] text-[color:var(--color-text-secondary)]">
            {product.stockQuantity > 0
              ? `${product.stockQuantity} left`
              : "Out of stock"}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 rounded-[10px] bg-[color:var(--color-primary)] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[color:var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
            {justAdded ? "Added" : "Add to cart"}
          </button>
        </div>
      </div>
    </Link>
  );
}
