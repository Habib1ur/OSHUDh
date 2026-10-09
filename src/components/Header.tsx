import { Search, ShoppingCart, User, MapPin, Menu, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { categories, products } from "../data/demo";
import { useCartStore } from "../store/cart";
import { useAuthStore } from "../store/auth";

const navItems = [
  { name: "Medicines", slug: "medicines" },
  { name: "Lab Tests", slug: "lab-tests" },
  { name: "Doctor Consultation", slug: "doctor-consultation" },
  { name: "Healthcare", slug: "healthcare" },
  { name: "Beauty and Skincare", slug: "beauty-skincare" },
  { name: "Baby and Mom Care", slug: "baby-mom-care" },
  { name: "Supplements and Nutrition", slug: "supplements-nutrition" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Medical Devices", slug: "medical-devices" },
  { name: "Pet Care", slug: "pet-care" },
];

export default function Header() {
  const navigate = useNavigate();
  const itemCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const { isLoggedIn, user } = useAuthStore();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const suggestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return products
      .filter((product) => {
        const haystack =
          `${product.name} ${product.productAttributes.generic ?? ""}`.toLowerCase();
        return haystack.includes(normalized);
      })
      .slice(0, 5);
  }, [query]);

  const handleSearch = (value: string) => {
    const term = value.trim();
    if (!term) return;
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setQuery("");
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--color-border)] bg-[color:var(--color-page)]">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-5">
        <div className="flex flex-col gap-3 rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 py-2 shadow-[var(--shadow-soft)] md:flex-row md:items-center">
          <div className="flex items-center gap-3 md:w-[220px]">
            <button
              type="button"
              className="inline-flex rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-page)] p-2 text-[color:var(--color-text)] md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-primary-soft)] text-lg font-black text-[color:var(--color-primary)]">
                O
              </div>
              <div>
                <div className="text-lg font-extrabold tracking-[-0.06em] text-[color:var(--color-text)]">
                  OSHUDH
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
                  Healthcare
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden flex-1 items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-page)] px-3 py-2 md:flex">
            <MapPin className="h-4 w-4 text-[color:var(--color-primary)]" />
            <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">
              Dhaka
            </span>
          </div>

          <div className="relative flex-1">
            <div className="flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-page)] px-3 py-2.5 focus-within:border-[color:var(--color-primary)] focus-within:bg-[color:var(--color-surface)] sm:py-3">
              <Search className="h-4 w-4 text-[color:var(--color-text-secondary)] sm:h-5 sm:w-5" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch(query);
                  }
                }}
                placeholder="Search medicines, brands, generics"
                className="w-full bg-transparent text-sm text-[color:var(--color-text)] outline-none placeholder:text-[color:var(--color-text-secondary)] sm:text-base"
                aria-label="Search medicines and products"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-xs font-medium text-[color:var(--color-text-secondary)] hover:text-[color:var(--color-primary)]"
                >
                  Clear
                </button>
              )}
            </div>
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-[0_20px_40px_-25px_rgba(23,33,28,0.35)]">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSearch(item.name)}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-page)]"
                  >
                    <span>{item.name}</span>
                    <span className="text-[color:var(--color-text-secondary)]">
                      {item.productAttributes.generic ?? "Product"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {!isLoggedIn ? (
              <Link
                to="/register"
                className="rounded-full bg-[color:var(--color-primary)] px-3 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[color:var(--color-primary-hover)]"
              >
                Register
              </Link>
            ) : (
              <Link
                to="/account"
                className="flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm font-medium text-[color:var(--color-text)]"
              >
                <User className="h-4 w-4 text-[color:var(--color-primary)]" />
                {user ? user.name.split(" ")[0] : "Account"}
              </Link>
            )}
            <Link
              to="/cart"
              className="relative inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-3 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[color:var(--color-primary-hover)]"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>

        <nav className="mt-3 hidden items-center gap-2 overflow-x-auto pb-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              className="whitespace-nowrap rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {mobileOpen && (
          <div className="mt-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-soft)] md:hidden">
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="block rounded-xl px-2 py-2 text-sm text-[color:var(--color-text)] hover:bg-[color:var(--color-page)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <div className="flex items-center justify-between border-t border-[color:var(--color-border)] pt-3">
                <Link
                  to={isLoggedIn ? "/account" : "/register"}
                  className="text-sm font-medium text-[color:var(--color-text)]"
                >
                  {isLoggedIn ? "Account" : "Register"}
                </Link>
                <Link
                  to="/cart"
                  className="text-sm font-medium text-[color:var(--color-text)]"
                >
                  Cart ({itemCount})
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
