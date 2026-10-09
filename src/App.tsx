import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  FileText,
  HeartPulse,
  MapPin,
  MessageSquareHeart,
  Phone,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Stethoscope,
  Truck,
  Upload,
  UserRound,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BrowserRouter,
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { z } from "zod";

import FAQAccordion from "./components/FAQAccordion";
import Layout from "./components/Layout";
import ProductCard from "./components/ProductCard";
import {
  brands,
  categories,
  demoAddresses,
  doctors,
  faqs,
  labTests,
  products,
} from "./data/demo";
import { formatCurrency, formatDate, getDiscountPercent } from "./lib/utils";
import { useAuthStore } from "./store/auth";
import {
  getCartDeliveryFee,
  getCartDiscount,
  getCartSubtotal,
  useCartStore,
} from "./store/cart";
import { useOrdersStore } from "./store/orders";
import type { Order, Product } from "./types";

const queryClient = new QueryClient();

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Add a valid phone number"),
  email: z.string().email("Email must be valid").optional().or(z.literal("")),
  address: z.string().min(8, "Address is required"),
  deliveryOption: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["cod", "demo-wallet", "card"]),
  termsAccepted: z
    .boolean()
    .refine((value) => value, "You must accept the terms"),
});

const sortProducts = (items: Product[], sortBy: string) => {
  const sorted = [...items];
  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.unitPrice - b.unitPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.unitPrice - a.unitPrice);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

function AppShell() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function HomePage() {
  const featuredProducts = products.slice(0, 6);

  const serviceHighlights = [
    { label: "Trusted items", icon: ShieldCheck },
    { label: "Fast delivery", icon: Truck },
    { label: "Care support", icon: HeartPulse },
  ];

  const efficientSteps = [
    {
      title: "Find care quickly",
      description:
        "Search trusted medicines, lab packs, consultations, and daily essentials in one place.",
      icon: ShoppingBag,
    },
    {
      title: "Upload & review",
      description:
        "Submit prescriptions digitally and get guided pharmacist review before checkout.",
      icon: Upload,
    },
    {
      title: "Track every order",
      description:
        "Receive clear delivery updates, order tracking, and post-purchase care support.",
      icon: BadgeCheck,
    },
  ];

  const shoppingPillars = [
    {
      title: "Immunity",
      subtitle: "Vitamin boosts & wellness",
      href: "/category/supplements-nutrition",
      icon: HeartPulse,
    },
    {
      title: "Pain relief",
      subtitle: "Everyday care basics",
      href: "/category/medicines",
      icon: ShoppingBag,
    },
    {
      title: "Baby care",
      subtitle: "Gentle essentials",
      href: "/category/baby-mom-care",
      icon: BadgeCheck,
    },
    {
      title: "Skin health",
      subtitle: "Beauty & skincare",
      href: "/category/beauty-skincare",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      <section className="section-shell relative overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(11,122,91,0.10),_transparent_32%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-primary-soft)] bg-[color:var(--color-primary-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-primary)]">
              <Sparkles className="h-3.5 w-3.5" />
              Simple healthcare shopping
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-[clamp(2.5rem,5vw,4.8rem)] font-black leading-[0.96] tracking-[-0.07em] text-[color:var(--color-text)]">
                Smarter care, faster delivery, better health outcomes.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-[color:var(--color-text-secondary)] sm:text-xl">
                Buy trusted medicines, daily wellness essentials, and doctor or
                lab care in one easy, stress-free store.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/category/medicines"
                className="inline-flex items-center justify-center rounded-[10px] bg-[color:var(--color-primary)] px-5 py-3.5 text-base font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[color:var(--color-primary-hover)]"
              >
                Shop essentials
              </Link>
              <Link
                to="/upload-prescription"
                className="inline-flex items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-3.5 text-base font-semibold text-[color:var(--color-text)] transition hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
              >
                Upload prescription
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5 text-sm text-[color:var(--color-text-secondary)]">
              {serviceHighlights.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-page)] px-3 py-2"
                >
                  <Icon className="h-4 w-4 text-[color:var(--color-primary)]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-10 h-24 w-24 rounded-full bg-[color:var(--color-primary-soft)] blur-2xl" />
            <div className="absolute -right-5 bottom-8 h-28 w-28 rounded-full bg-[#dbeafe] blur-2xl" />
            <div className="relative overflow-hidden rounded-[30px] border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-primary-soft)] via-[color:var(--color-surface)] to-[#f0f9ff] p-3 shadow-[var(--shadow-soft)]">
              <img
                src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
                alt="Healthcare essentials and medicine products"
                className="h-[370px] w-full rounded-[24px] object-cover"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/60 bg-white/85 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      Today’s care
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      Home care essentials
                    </p>
                  </div>
                  <span className="rounded-full bg-[#dff7ee] px-2 py-1 text-[10px] font-semibold text-[#0b7a5b]">
                    4.9 / 5
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>Delivery in 30 mins</span>
                  <span className="font-semibold text-slate-900">
                    22K+ saved orders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: "22K+", label: "Orders delivered" },
          { value: "98.4%", label: "Order satisfaction" },
          { value: "15 min", label: "Average dispatch" },
          { value: "1,200+", label: "Healthcare partners" },
        ].map((stat) => (
          <div key={stat.label} className="soft-card p-4 sm:p-5">
            <div className="text-2xl font-black tracking-[-0.05em] text-[color:var(--color-text)] sm:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-3xl">
            Shop by health need
          </h2>
          <Link
            to="/search"
            className="text-sm font-semibold text-[color:var(--color-primary)]"
          >
            See all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {shoppingPillars.map(({ title, subtitle, href, icon: Icon }) => (
            <Link
              key={title}
              to={href}
              className="rounded-[22px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[0_12px_30px_-25px_rgba(23,33,28,0.28)] transition hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-lg font-semibold text-[color:var(--color-text)]">
                {title}
              </div>
              <div className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                {subtitle}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-3xl lg:text-4xl">
            Built for everyday healthcare decisions
          </h2>
          <Link
            to="/search"
            className="text-sm font-semibold text-[color:var(--color-primary)] sm:text-base"
          >
            Explore catalog
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {efficientSteps.map(({ title, description, icon: Icon }) => (
            <div key={title} className="soft-card p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-[color:var(--color-text)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-3xl lg:text-4xl">
            Popular categories
          </h2>
          <Link
            to="/search"
            className="text-sm font-semibold text-[color:var(--color-primary)] sm:text-base"
          >
            Browse all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group soft-card overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {category.description}
                  </p>
                </div>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#dff7ee] text-[#0b7a5b]">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-3xl lg:text-4xl">
            Top picks for your routine
          </h2>
          <Link
            to="/search"
            className="text-sm font-semibold text-[color:var(--color-primary)] sm:text-base"
          >
            View all deals
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="section-shell bg-[linear-gradient(135deg,rgba(234,247,240,0.75),rgba(255,255,255,0.9))] p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-3xl lg:text-4xl">
            Healthcare services
          </h2>
          <Link
            to="/doctors"
            className="text-sm font-semibold text-[color:var(--color-primary)] sm:text-base"
          >
            Book a visit
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Doctor consultation",
              description:
                "Book evidence-based virtual consultations with verified specialists.",
              icon: Stethoscope,
            },
            {
              title: "Lab test booking",
              description:
                "Schedule at-home sample collection and digital health reporting.",
              icon: FileText,
            },
            {
              title: "Prescription support",
              description:
                "Upload a prescription and receive pharmacist support before checkout.",
              icon: BadgeCheck,
            },
          ].map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[24px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[0_16px_40px_-32px_rgba(23,33,28,0.22)] transition hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)] shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-[color:var(--color-text)]">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--color-text-secondary)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-[color:var(--color-text)] sm:text-3xl lg:text-4xl">
            Frequently asked questions
          </h2>
          <FAQAccordion items={faqs} />
        </div>

        <div className="section-shell bg-[linear-gradient(180deg,rgba(234,247,240,0.5),rgba(255,255,255,1))] p-5 sm:p-6">
          <h3 className="text-2xl font-bold text-[color:var(--color-text)]">
            Need help?
          </h3>
          <div className="mt-5 space-y-3 text-sm text-[color:var(--color-text-secondary)]">
            <PhoneOrMap
              icon={<Phone />}
              label="Call support"
              value="+880 1700-000000"
            />
            <PhoneOrMap
              icon={<MessageSquareHeart />}
              label="WhatsApp"
              value="Chat now"
            />
            <PhoneOrMap
              icon={<MapPin />}
              label="Store address"
              value="Dhanmondi, Dhaka"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PhoneOrMap({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 shadow-[0_12px_24px_-22px_rgba(23,33,28,0.28)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-primary-soft)] text-[color:var(--color-primary)]">
        {icon}
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
          {label}
        </div>
        <div className="font-medium text-[color:var(--color-text)]">
          {value}
        </div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();
  const [sort, setSort] = useState("relevance");

  const filtered = useMemo(() => {
    const next = products.filter((product) => {
      if (!query) return true;
      const haystack =
        `${product.name} ${product.genericName ?? ""} ${product.productAttributes.generic ?? ""} ${brands.find((brand) => brand.id === product.brandId)?.name ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
    return sortProducts(next, sort);
  }, [query, sort]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
              Search results
            </div>
            <h1 className="mt-2 text-3xl font-bold text-[color:var(--color-text)]">
              {query ? `Results for “${query}”` : "All products"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-page)] px-3 py-2 text-sm text-[color:var(--color-text)] outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
            {query && (
              <button
                type="button"
                onClick={() => setSearchParams({})}
                className="rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-sm text-[color:var(--color-text)]"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 text-center">
          <h2 className="text-xl font-semibold text-[color:var(--color-text)]">
            No products match your search.
          </h2>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            Try a different product name, brand, or generic keyword.
          </p>
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="mt-4 rounded-xl bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find((item) => item.slug === slug);
  const [searchParams, setSearchParams] = useSearchParams();
  const brandFilter = searchParams.get("brand") ?? "all";
  const sortBy = searchParams.get("sort") ?? "relevance";

  const items = products.filter(
    (product) =>
      product.categoryId === category?.id || category?.slug === "medicines",
  );
  const filtered = items.filter((product) =>
    brandFilter === "all" ? true : product.brandId === brandFilter,
  );
  const arranged = sortProducts(filtered, sortBy);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)] ring-1 ring-[color:var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
          <Link to="/">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{category?.name ?? "Category"}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-[color:var(--color-text)]">
          {category?.name ?? "Category"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[color:var(--color-text-secondary)]">
          {category?.description ??
            "Explore trusted healthcare essentials for your routine."}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-soft)]">
          <h2 className="font-semibold text-[color:var(--color-text)]">
            Filter by brand
          </h2>
          <div className="mt-3 space-y-2">
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className={`w-full rounded-xl px-3 py-2 text-left text-sm ${brandFilter === "all" ? "bg-[color:var(--color-primary)] text-white" : "bg-[color:var(--color-page)] text-[color:var(--color-text)]"}`}
            >
              All brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() =>
                  setSearchParams({ brand: brand.id, sort: sortBy })
                }
                className={`w-full rounded-xl px-3 py-2 text-left text-sm ${brandFilter === brand.id ? "bg-[color:var(--color-primary)] text-white" : "bg-[color:var(--color-page)] text-[color:var(--color-text)]"}`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[color:var(--color-text-secondary)]">
              {arranged.length} products found
            </div>
            <select
              value={sortBy}
              onChange={(event) =>
                setSearchParams({
                  ...(brandFilter === "all" ? {} : { brand: brandFilter }),
                  sort: event.target.value,
                })
              }
              className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-page)] px-3 py-2 text-sm text-[color:var(--color-text)]"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price low to high</option>
              <option value="price-desc">Price high to low</option>
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {arranged.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPage() {
  const { slug } = useParams();
  const brand = brands.find((item) => item.slug === slug);
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sort") ?? "relevance";
  const items = products.filter((product) => product.brandId === brand?.id);
  const arranged = sortProducts(items, sortBy);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{brand?.name ?? "Brand"}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          {brand?.name ?? "Brand"}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {arranged.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (!product) return <NotFoundPage />;

  const relatedProducts = products
    .filter(
      (item) =>
        item.categoryId === product.categoryId && item.id !== product.id,
    )
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-soft)] ring-1 ring-[color:var(--color-border)]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-text-secondary)]">
          <Link to="/">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to={`/category/${categories.find((item) => item.id === product.categoryId)?.slug ?? ""}`}
          >
            {categories.find((item) => item.id === product.categoryId)?.name ??
              "Category"}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[28px] bg-slate-100 shadow-[var(--shadow-soft)]">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-[420px] w-full object-contain p-4"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.map((image) => (
              <div
                key={image}
                className="overflow-hidden rounded-2xl bg-slate-100"
              >
                <img
                  src={image}
                  alt={product.name}
                  className="h-24 w-full object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-[color:var(--color-primary-soft)] px-2 py-1 text-[10px] font-semibold uppercase text-[color:var(--color-primary)]">
              {product.availability}
            </span>
            {product.requiresPrescription && (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                Prescription required
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold text-[color:var(--color-text)]">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-[color:var(--color-text-secondary)]">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount} reviews)</span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <span className="text-3xl font-black text-[color:var(--color-primary)]">
              {formatCurrency(product.unitPrice)}
            </span>
            {product.referencePrice && (
              <span className="text-sm text-[color:var(--color-text-secondary)] line-through">
                {formatCurrency(product.referencePrice)}
              </span>
            )}
            {product.referencePrice && (
              <span className="text-xs font-semibold text-[color:var(--color-primary)]">
                {getDiscountPercent(product.referencePrice, product.unitPrice)}%
                OFF
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-page)]">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="px-3 py-2 text-lg text-[color:var(--color-text)]"
              >
                −
              </button>
              <span className="min-w-10 text-center text-sm font-medium text-[color:var(--color-text)]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((value) => value + 1)}
                className="px-3 py-2 text-lg text-[color:var(--color-text)]"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => addItem(product)}
              className="flex-1 rounded-xl bg-[color:var(--color-primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[color:var(--color-primary-hover)]"
            >
              Add to cart
            </button>
          </div>

          <div className="mt-5 space-y-3 text-sm text-[color:var(--color-text-secondary)]">
            <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] p-3">
              <span>Brand</span>
              <span className="text-[color:var(--color-text)]">
                {brands.find((item) => item.id === product.brandId)?.name}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] p-3">
              <span>Package</span>
              <span className="text-[color:var(--color-text)]">
                {product.packageSize}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[color:var(--color-border)] p-3">
              <span>SKU</span>
              <span className="text-[color:var(--color-text)]">
                {product.sku}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-bold text-[color:var(--color-text)]">
            Product details
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-secondary)]">
            {product.description}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Object.entries(product.productAttributes).map(([key, value]) => (
              <div
                key={key}
                className="rounded-xl bg-[color:var(--color-page)] p-3"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
                  {key}
                </div>
                <div className="mt-1 font-medium text-[color:var(--color-text)]">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-bold text-[color:var(--color-text)]">
            Delivery & return
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-[color:var(--color-text-secondary)]">
            <li className="flex gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-[color:var(--color-primary)]" />{" "}
              Express and standard delivery options available for Bangladesh.
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 text-[color:var(--color-primary)]" />{" "}
              Easy return eligibility on damaged or incorrect items.
            </li>
            <li className="flex gap-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-[color:var(--color-primary)]" />{" "}
              Prescription-flagged products are reviewed before finalization.
            </li>
          </ul>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Related products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CartPage() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [message, setMessage] = useState("");
  const subtotal = getCartSubtotal(items);
  const discount = getCartDiscount(subtotal, couponCode);
  const deliveryFee = getCartDeliveryFee(subtotal);
  const total = subtotal - discount + deliveryFee;
  const setCoupon = useCartStore((state) => state.setCoupon);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const handleApplyCoupon = () => {
    const normalized = couponInput.trim().toUpperCase();
    if (!normalized) {
      setMessage("Please enter a coupon code.");
      return;
    }
    if (normalized === "SAVE10" || normalized === "WELCOME25") {
      setCoupon(normalized);
      setMessage("Coupon applied successfully.");
      return;
    }
    setCoupon(null);
    setMessage("This coupon is not eligible for the current order.");
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
        <ShoppingCart className="mx-auto h-12 w-12 text-slate-300" />
        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Add medicines, wellbeing essentials, or healthcare browsing favorites
          to get started.
        </p>
        <Link
          to="/search"
          className="mt-5 inline-block rounded-xl bg-[#0b7a5b] px-4 py-2 text-sm font-semibold text-white"
        >
          Shop now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        {items.map((item) => {
          const product = products.find(
            (productItem) => productItem.id === item.productId,
          );
          if (!product) return null;

          return (
            <div
              key={item.productId}
              className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-[var(--shadow-soft)] sm:flex-row"
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-28 w-28 rounded-2xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-[color:var(--color-text)]">
                      {product.name}
                    </h2>
                    <p className="text-xs text-[color:var(--color-text-secondary)]">
                      {product.packageSize}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-[color:var(--color-text-secondary)]"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-page)]">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, -1)}
                      className="px-3 py-2 text-lg text-[color:var(--color-text)]"
                    >
                      −
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium text-[color:var(--color-text)]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, 1)}
                      className="px-3 py-2 text-lg text-[color:var(--color-text)]"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-bold text-[color:var(--color-text)]">
                    {formatCurrency(item.unitPriceSnapshot * item.quantity)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <aside className="rounded-[28px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-[var(--shadow-soft)]">
        <h2 className="text-xl font-bold text-[color:var(--color-text)]">
          Order summary
        </h2>
        <div className="mt-4 space-y-3 text-sm text-[color:var(--color-text-secondary)]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-[color:var(--color-page)] p-3">
          <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-secondary)]">
            Coupon
          </label>
          <div className="mt-2 flex gap-2">
            <input
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              placeholder="SAVE10"
              className="w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="rounded-xl bg-[color:var(--color-primary)] px-3 py-2 text-sm font-medium text-white"
            >
              Apply
            </button>
          </div>
          {message && (
            <p className="mt-2 text-xs text-[color:var(--color-text-secondary)]">
              {message}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[color:var(--color-border)] pt-4">
          <span className="text-lg font-bold text-[color:var(--color-text)]">
            Total
          </span>
          <span className="text-xl font-black text-[color:var(--color-primary)]">
            {formatCurrency(total)}
          </span>
        </div>

        <Link
          to="/checkout"
          className="mt-5 block rounded-xl bg-[color:var(--color-primary)] px-4 py-3 text-center text-sm font-semibold text-white"
        >
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const addOrder = useOrdersStore((state) => state.addOrder);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = getCartSubtotal(items);
  const discount = getCartDiscount(subtotal, couponCode);
  const deliveryFee = getCartDeliveryFee(subtotal);
  const total = subtotal - discount + deliveryFee;
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name ?? "",
      phone: user?.phone ?? "",
      email: user?.email ?? "",
      address: demoAddresses[0]?.streetAddress ?? "",
      deliveryOption: "standard",
      paymentMethod: "cod",
      termsAccepted: false,
    },
  });

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    const order: Order = {
      id: `OS-${Date.now()}`,
      userId: "demo-user",
      items: items.map((item) => {
        const product = products.find(
          (productItem) => productItem.id === item.productId,
        );
        return {
          productId: item.productId,
          name: product?.name ?? "Product",
          quantity: item.quantity,
          unitPrice: item.unitPriceSnapshot,
          subtotal: item.unitPriceSnapshot * item.quantity,
        };
      }),
      addressSnapshot: `${values.address} • ${demoAddresses[0]?.district ?? "Dhaka"}`,
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod: values.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "Awaiting prescription review",
      prescriptionStatus: "uploaded",
      createdAt: new Date().toISOString(),
    };
    addOrder(order);
    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h1 className="text-2xl font-bold">Checkout is empty.</h1>
        <Link
          to="/search"
          className="mt-4 inline-block rounded-xl bg-[#0b7a5b] px-4 py-2 text-sm text-white"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const paymentMethod = watch("paymentMethod");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              1. Customer information
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  {...register("fullName")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  {...register("email")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">2. Delivery</h2>
            <div className="mt-4">
              <label className="text-sm font-medium text-slate-700">
                Delivery address
              </label>
              <textarea
                {...register("address")}
                rows={3}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.address.message}
                </p>
              )}
            </div>
            <div className="mt-4 space-y-3">
              {demoAddresses.map((address) => (
                <label
                  key={address.id}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <input
                    type="radio"
                    name="deliveryAddress"
                    defaultChecked={address.isDefault}
                  />
                  <div>
                    <div className="font-medium text-slate-800">
                      {address.recipientName}
                    </div>
                    <div className="text-sm text-slate-600">
                      {address.streetAddress}, {address.area},{" "}
                      {address.district}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Delivery option
                </label>
                <select
                  {...register("deliveryOption")}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
                >
                  <option value="standard">Standard delivery</option>
                  <option value="express">Express delivery</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Estimated window
                </label>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                  {watch("deliveryOption") === "express"
                    ? "Tomorrow, 12:00 - 4:00 PM"
                    : "Within 2-3 days"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              3. Prescription status
            </h2>
            <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
              Prescription review is required for any flagged medicines. Our
              care team verifies each request before final order processing.
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
              <Upload className="h-4 w-4" /> Uploaded prescription: under review
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">4. Payment</h2>
            <div className="mt-4 space-y-3">
              {["cod", "demo-wallet", "card"].map((method) => (
                <label
                  key={method}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <div className="flex items-center gap-3">
                    {method === "cod" ? (
                      <WalletCards className="h-4 w-4 text-slate-600" />
                    ) : method === "demo-wallet" ? (
                      <UserRound className="h-4 w-4 text-slate-600" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-slate-600" />
                    )}
                    <span className="text-sm text-slate-700">
                      {method === "cod"
                        ? "Cash on delivery"
                        : method === "demo-wallet"
                          ? "Wallet balance"
                          : "Card payment"}
                    </span>
                  </div>
                  <input
                    type="radio"
                    value={method}
                    {...register("paymentMethod")}
                  />
                </label>
              ))}
            </div>
            {paymentMethod === "card" && (
              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                Secure checkout flow for order confirmation and payment review.
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              5. Review and consent
            </h2>
            <label className="mt-4 flex items-start gap-3 rounded-xl border border-slate-200 p-3">
              <input type="checkbox" {...register("termsAccepted")} />
              <span className="text-sm text-slate-600">
                I agree to the delivery, return, and privacy terms and confirm
                my order details are correct before final submission.
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.termsAccepted.message}
              </p>
            )}
          </section>
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Order review</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => {
              const product = products.find(
                (productItem) => productItem.id === item.productId,
              );
              if (!product) return null;
              return (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {product.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Qty {item.quantity}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {formatCurrency(item.unitPriceSnapshot * item.quantity)}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-[#0b7a5b] px-4 py-3 text-sm font-semibold text-white"
          >
            Place order
          </button>
        </aside>
      </div>
    </form>
  );
}

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const order = useOrdersStore((state) =>
    state.orders.find((item) => item.id === orderId),
  );

  if (!order) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-2xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#dff7ee] text-[#0b7a5b]">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        Order confirmed
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Your order reference is{" "}
        <span className="font-semibold text-slate-900">{order.id}</span>.
      </p>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Items</span>
          <span>{order.items.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/orders"
          className="rounded-xl bg-[#0b7a5b] px-4 py-2 text-sm font-semibold text-white"
        >
          Track order
        </Link>
        <Link
          to="/"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

function OrdersPage() {
  const orders = useOrdersStore((state) => state.orders);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Order history</h1>
      </div>
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
          No orders yet. Start with a medicine or wellness order from your cart.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="block rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {order.id}
                  </div>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    {order.orderStatus}
                  </h2>
                </div>
                <div className="text-sm text-slate-500">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                <span>{order.items.length} items</span>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderDetailPage() {
  const { orderId } = useParams();
  const order = useOrdersStore((state) =>
    state.orders.find((item) => item.id === orderId),
  );
  if (!order) return <NotFoundPage />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Order reference
            </div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {order.id}
            </h1>
          </div>
          <span className="rounded-full bg-[#dff7ee] px-3 py-1 text-xs font-semibold text-[#0b7a5b]">
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Items</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3"
              >
                <div>
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-500">
                    Qty {item.quantity}
                  </div>
                </div>
                <div className="font-semibold text-slate-800">
                  {formatCurrency(item.subtotal)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Summary</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{formatCurrency(order.deliveryFee)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrescriptionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<
    "not-submitted" | "uploaded" | "under-review" | "approved"
  >("not-submitted");
  const [error, setError] = useState("");

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Only JPG, PNG or PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be 5MB or smaller.");
      return;
    }
    setError("");
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setStatus("not-submitted");
      setError("Upload a prescription before submitting.");
      return;
    }
    setStatus("uploaded");
    setError("");
    setTimeout(() => setStatus("under-review"), 800);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Prescription upload
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload a valid prescription image or PDF for pharmacist evaluation and
          order confirmation.
        </p>
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-4">
          <input
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            onChange={handleFile}
            className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-[#dff7ee] file:px-3 file:py-2 file:font-medium file:text-[#0b7a5b]"
          />
          {selectedFile && (
            <div className="mt-3 text-sm text-slate-700">
              Selected: {selectedFile.name}
            </div>
          )}
          {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
        </div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={4}
          placeholder="Optional note for the pharmacist"
          className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
        />
        <button
          type="button"
          onClick={handleSubmit}
          className="mt-4 w-full rounded-xl bg-[#0b7a5b] px-4 py-3 text-sm font-semibold text-white"
        >
          Submit for review
        </button>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Status</h2>
        <div className="mt-4 space-y-3">
          {[
            { label: "Not submitted", active: status === "not-submitted" },
            { label: "Uploaded", active: status === "uploaded" },
            { label: "Under review", active: status === "under-review" },
            { label: "Approved", active: status === "approved" },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-xl border p-3 ${item.active ? "border-[#0b7a5b] bg-[#dff7ee]" : "border-slate-200 bg-slate-50"}`}
            >
              <span className="text-sm font-medium text-slate-700">
                {item.label}
              </span>
              {item.active && (
                <CheckCircle2 className="h-4 w-4 text-[#0b7a5b]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Doctor consultation
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => (
          <Link
            key={doctor.id}
            to={`/doctors/${doctor.slug}`}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="bg-slate-100">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="h-60 w-full object-contain p-3"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {doctor.name}
                </h3>
                <span className="rounded-full bg-[#dff7ee] px-2 py-1 text-[10px] font-semibold text-[#0b7a5b]">
                  {doctor.specialty}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {doctor.qualification}
              </p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#0b7a5b]">
                  {formatCurrency(doctor.fee)}
                </span>
                <span className="text-slate-500">⭐ {doctor.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DoctorDetailPage() {
  const { slug } = useParams();
  const doctor = doctors.find((item) => item.slug === slug);
  if (!doctor) return <NotFoundPage />;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-hidden rounded-[24px] bg-slate-100">
          <img
            src={doctor.image}
            alt={doctor.name}
            className="h-80 w-full object-contain p-4"
          />
        </div>
      </div>
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{doctor.name}</h1>
        <p className="mt-2 text-sm text-slate-600">{doctor.specialty}</p>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="font-semibold text-slate-800">Qualification:</span>{" "}
            {doctor.qualification}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="font-semibold text-slate-800">Registration:</span>{" "}
            {doctor.registration}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="font-semibold text-slate-800">
              Consultation fee:
            </span>{" "}
            {formatCurrency(doctor.fee)}
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Available slots
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {doctor.availability.map((slot) => (
              <button
                key={slot}
                type="button"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LabTestsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Lab tests</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labTests.map((labTest) => (
          <Link
            key={labTest.id}
            to={`/lab-tests/${labTest.slug}`}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="bg-slate-100">
              <img
                src={labTest.image}
                alt={labTest.name}
                className="h-52 w-full object-contain p-3"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  {labTest.name}
                </h3>
                <span className="rounded-full bg-[#dff7ee] px-2 py-1 text-[10px] font-semibold text-[#0b7a5b]">
                  {labTest.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {labTest.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-bold text-[#0b7a5b]">
                  {formatCurrency(labTest.price)}
                </span>
                <span className="text-xs text-slate-500">
                  {labTest.duration}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function LabTestDetailPage() {
  const { slug } = useParams();
  const labTest = labTests.find((item) => item.slug === slug);
  if (!labTest) return <NotFoundPage />;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-hidden rounded-[24px] bg-slate-100">
          <img
            src={labTest.image}
            alt={labTest.name}
            className="h-72 w-full object-contain p-4"
          />
        </div>
      </div>
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">{labTest.name}</h1>
          <span className="rounded-full bg-[#dff7ee] px-2 py-1 text-[10px] font-semibold text-[#0b7a5b]">
            {labTest.category}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-600">{labTest.description}</p>
        <div className="mt-4 grid gap-3 text-sm text-slate-600">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="font-semibold text-slate-800">Price:</span>{" "}
            {formatCurrency(labTest.price)}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="font-semibold text-slate-800">Preparation:</span>{" "}
            {labTest.preparation}
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="font-semibold text-slate-800">Timing:</span>{" "}
            {labTest.duration}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) return;

    register({
      name: form.name,
      email: form.email,
      phone: form.phone,
    });
    navigate("/account");
  };

  return (
    <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Join Oshudh to track orders, save prescriptions, and manage healthcare
        needs in one place.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Your full name"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, email: event.target.value }))
            }
            placeholder="hello@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">
            Phone number
          </label>
          <input
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
            placeholder="+8801XXXXXXXXX"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, password: event.target.value }))
            }
            placeholder="Create a password"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#0b7a5b] px-4 py-3 text-sm font-semibold text-white"
        >
          Create account
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/account" className="font-semibold text-[#0b7a5b]">
          Go to account
        </Link>
      </p>
    </div>
  );
}

function AccountPage() {
  const { user, isLoggedIn, logout } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Account
            </div>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {isLoggedIn ? (user?.name ?? "Hello") : "Guest account"}
            </h1>
          </div>
          <button
            onClick={logout}
            type="button"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Profile", value: user?.email ?? "care@oshudh.com" },
          { label: "Addresses", value: "2 saved" },
          { label: "Rewards", value: "৳250 wallet" },
          { label: "Prescription records", value: "2 files" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
              {item.label}
            </div>
            <p className="mt-3 text-lg font-semibold text-slate-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Saved addresses</h2>
          <div className="mt-4 space-y-3">
            {demoAddresses.map((address) => (
              <div
                key={address.id}
                className="rounded-xl border border-slate-200 p-3 text-sm text-slate-600"
              >
                <div className="font-medium text-slate-800">
                  {address.recipientName}
                </div>
                <div>{address.streetAddress}</div>
                <div>
                  {address.area}, {address.district}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Rewards</h2>
          <div className="mt-4 rounded-2xl bg-[#dff7ee] p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#0b7a5b]">
              Wallet
            </div>
            <div className="mt-2 text-3xl font-black text-[#0b7a5b]">৳250</div>
          </div>
          <div className="mt-4 text-sm text-slate-600">
            Your wallet balance is ready for eligible health and wellness
            orders.
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Contact support</h1>
      <p className="mt-2 text-sm text-slate-600">
        Send a support message or reach out about an order, prescription, or
        medical product question.
      </p>
      <form className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Your name
          </label>
          <input
            placeholder="Your name"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="hello@example.com"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            rows={5}
            placeholder="Tell us how we can help"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none"
          />
        </div>
        <button
          type="button"
          className="rounded-xl bg-[#0b7a5b] px-4 py-2.5 text-sm font-semibold text-white"
        >
          Send message
        </button>
      </form>
    </div>
  );
}

function LegalPage({ title, content }: { title: string; content: string }) {
  return (
    <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-4 text-sm leading-7 text-slate-600">{content}</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">
        The page you requested does not exist in our storefront.
      </p>
      <Link
        to="/"
        className="mt-5 inline-block rounded-xl bg-[#0b7a5b] px-4 py-2 text-sm font-semibold text-white"
      >
        Back home
      </Link>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/brand/:slug" element={<BrandPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/order-confirmation/:orderId"
              element={<OrderConfirmationPage />}
            />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/upload-prescription" element={<PrescriptionPage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/:slug" element={<DoctorDetailPage />} />
            <Route path="/lab-tests" element={<LabTestsPage />} />
            <Route path="/lab-tests/:slug" element={<LabTestDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/faq"
              element={
                <LegalPage
                  title="FAQ"
                  content="Our FAQ covers common customer questions around prescription ordering, medicine delivery, product authenticity, and support for daily healthcare needs."
                />
              }
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/privacy"
              element={
                <LegalPage
                  title="Privacy policy"
                  content="We handle personal health information responsibly, limit access to authorized staff, and protect customer records in line with healthcare privacy expectations and secure digital practices."
                />
              }
            />
            <Route
              path="/terms"
              element={
                <LegalPage
                  title="Terms of service"
                  content="These terms govern the use of our healthcare storefront, including ordering, delivery coordination, prescription review, and customer support for medicines and wellness products."
                />
              }
            />
            <Route
              path="/returns"
              element={
                <LegalPage
                  title="Returns and refunds"
                  content="Returns apply to incorrect or damaged items only. In production, a real pharmacy workflow must validate the return against the product, prescription review, and customer records."
                />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
