"use client";

import { useMemo, useState } from "react";
import {
  ShoppingBag,
  Plus,
  Search,
  Tag,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  X,
  Sparkles,
  CheckCircle2,
  Bike,
  Calculator,
  Laptop,
  Book,
  Zap,
  Bed,
  Dumbbell,
  Radio,
} from "lucide-react";
import { MARKETPLACE_LISTINGS, type MarketplaceListing } from "@/lib/campus-data";
import { useSessionItems } from "@/lib/session-store";
import { DemoNotice } from "@/components/os/DemoNotice";
import { SessionStorageNotice } from "@/components/os/SessionStorageNotice";
import { EmptyState } from "@/components/os/EmptyState";
import { PageIntro } from "@/components/os/PageIntro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All Items", icon: ShoppingBag, value: "All" },
  { label: "Electronics", icon: Laptop, value: "Electronics" },
  { label: "Vehicles & Cycles", icon: Bike, value: "Vehicles" },
  { label: "Books & Notes", icon: Book, value: "Books" },
  { label: "Study Gear", icon: Calculator, value: "Study" },
  { label: "Projects & Kits", icon: Zap, value: "Projects" },
  { label: "Hostel Essentials", icon: Bed, value: "Hostel" },
  { label: "Sports & Fitness", icon: Dumbbell, value: "Sports" },
] as const;

const LISTING_TYPES = ["All Types", "For Sale", "For Rent", "Free", "Lend / Borrow"] as const;
const CONDITIONS = ["All Conditions", "New", "Like new", "Good", "Used"] as const;

export default function MarketplacePage() {
  const { items, prepend, storageError } = useSessionItems<MarketplaceListing>(
    "campusos.marketplace",
    MARKETPLACE_LISTINGS
  );

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All Types");
  const [selectedCondition, setSelectedCondition] = useState<string>("All Conditions");
  const [sortBy, setSortBy] = useState<"Recent" | "PriceLow" | "PriceHigh">("Recent");
  const [selectedItem, setSelectedItem] = useState<MarketplaceListing | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  // New listing form state
  const [form, setForm] = useState({
    title: "",
    type: "For Sale" as MarketplaceListing["type"],
    category: "Study" as MarketplaceListing["category"],
    price: "",
    pricingUnit: "one-time",
    condition: "Good" as MarketplaceListing["condition"],
    location: "Central Quad",
    availability: "Available this week",
    description: "",
  });

  // Filtered & sorted listings
  const filteredListings = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCat = selectedCategory === "All" || item.category === selectedCategory;
        const matchesType = selectedType === "All Types" || item.type === selectedType;
        const matchesCond = selectedCondition === "All Conditions" || item.condition === selectedCondition;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          `${item.title} ${item.description} ${item.category} ${item.seller} ${item.location}`
            .toLowerCase()
            .includes(q);
        return matchesCat && matchesType && matchesCond && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === "PriceLow") return a.price - b.price;
        if (sortBy === "PriceHigh") return b.price - a.price;
        return a.sessionLocal ? -1 : 1;
      });
  }, [items, selectedCategory, selectedType, selectedCondition, query, sortBy]);

  // Telemetry counts
  const stats = useMemo(() => {
    const forSale = items.filter((i) => i.type === "For Sale").length;
    const forRent = items.filter((i) => i.type === "For Rent").length;
    const free = items.filter((i) => i.type === "Free").length;
    const lend = items.filter((i) => i.type === "Lend / Borrow").length;
    return { forSale, forRent, free, lend, total: items.length };
  }, [items]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const parsedPrice = form.type === "Free" || form.type === "Lend / Borrow" ? 0 : Number(form.price) || 0;

    const newListing: MarketplaceListing = {
      id: `m-${Date.now()}`,
      title: form.title.trim(),
      type: form.type,
      category: form.category,
      price: parsedPrice,
      pricingUnit: form.type === "Free" ? "free" : form.pricingUnit || "one-time",
      condition: form.condition,
      location: form.location.trim() || "Campus",
      seller: "Student User (You)",
      availability: form.availability.trim() || "Available",
      posted: "Just now",
      description: form.description.trim() || "No description provided.",
      accent: "from-primary/80 to-accent/40",
      sessionLocal: true,
    };

    prepend(newListing);
    setIsCreating(false);
    setForm({
      title: "",
      type: "For Sale",
      category: "Study",
      price: "",
      pricingUnit: "one-time",
      condition: "Good",
      location: "Central Quad",
      availability: "Available this week",
      description: "",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Vehicles":
        return Bike;
      case "Study":
        return Calculator;
      case "Electronics":
        return Laptop;
      case "Books":
        return Book;
      case "Projects":
        return Zap;
      case "Hostel":
        return Bed;
      case "Sports":
        return Dumbbell;
      default:
        return ShoppingBag;
    }
  };

  return (
    <div className="space-y-6 stagger-in">
      <PageIntro
        kicker="Campus Exchange"
        title="Campus Marketplace"
        description="A student-to-student exchange to buy, rent, lend, borrow, and give away gear, books, vehicles, and campus essentials."
      />

      <DemoNotice>
        Marketplace listings are demo records. Listings you create stay stored in your browser session; no monetary transaction or external message is processed.
      </DemoNotice>
      <SessionStorageNotice message={storageError} />

      {/* NexDash-inspired Marketplace Command Surface */}
      <section className="intelligence-surface relative overflow-hidden rounded-3xl p-6 lg:p-8 stagger-in">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-meta text-muted-foreground">
                Exchange Telemetry · Live Session
              </p>
            </div>
            <h2 className="text-display-lg tracking-tight">
              What campus has to offer, right now.
            </h2>
            <p className="max-w-2xl text-body leading-relaxed text-muted-foreground">
              Direct peer exchanges across hostels, lecture halls, and labs with zero platform fees.
            </p>

            {/* Status chips */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <Tag className="size-3.5 text-primary" />
                <strong>{stats.forSale}</strong> For Sale
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <Clock className="size-3.5 text-emerald-500" />
                <strong>{stats.forRent}</strong> For Rent
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <Sparkles className="size-3.5 text-amber-500" />
                <strong>{stats.free}</strong> Free on Campus
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
                <Radio className="size-3.5 text-purple-500" />
                <strong>{stats.lend}</strong> Lend / Borrow
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <Button
              onClick={() => setIsCreating(true)}
              className="gap-2 rounded-full shadow-lg shadow-primary/20 px-6 py-6 text-sm font-semibold"
            >
              <Plus className="size-4" />
              List an Item
            </Button>
          </div>
        </div>
      </section>

      {/* Category Pills Carousel / Wrap */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 custom-scrollbar">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2 text-xs font-medium transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border/80 bg-card hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Search & Multi-criteria Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings, gear, models, seller, or location…"
            className="pl-10 h-11 rounded-2xl bg-card border-border/80 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Listing type pills */}
          <div className="flex rounded-2xl border border-border bg-card p-1">
            {LISTING_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                  selectedType === type
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Condition selector */}
          <div className="flex items-center gap-1.5">
            <select
              aria-label="Filter by condition"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>

            {/* Sort selector */}
            <select
              aria-label="Sort marketplace items"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium text-foreground outline-none"
            >
              <option value="Recent">Newest First</option>
              <option value="PriceLow">Price: Low to High</option>
              <option value="PriceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      {filteredListings.length === 0 ? (
        <EmptyState
          title="No marketplace listings found"
          body="Try clearing your filters or search terms, or create a new student listing for this session."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((item) => {
            const CatIcon = getCategoryIcon(item.category);

            // Listing type pill style
            const typeStyle = {
              "For Sale": "bg-primary/10 text-primary border-primary/20",
              "For Rent": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
              Free: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
              "Lend / Borrow": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
            }[item.type];

            return (
              <article
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setContactSent(false);
                }}
                className="interactive-card group relative flex flex-col justify-between overflow-hidden rounded-3xl p-5 cursor-pointer"
              >
                <div>
                  {/* Top card visual bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent text-primary">
                        <CatIcon className="size-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.category}
                        </span>
                        <p className="text-xs text-muted-foreground">{item.posted}</p>
                      </div>
                    </div>

                    <span
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                        typeStyle
                      )}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 font-display text-lg font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Details & Price Bar */}
                <div className="mt-5 border-t border-border/70 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      {item.type === "Free" ? (
                        <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                          FREE
                        </span>
                      ) : item.type === "Lend / Borrow" ? (
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {item.pricingUnit}
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="font-display text-lg font-bold text-foreground">
                            ₹{item.price.toLocaleString("en-IN")}
                          </span>
                          {item.pricingUnit !== "one-time" && (
                            <span className="text-[10px] text-muted-foreground">{item.pricingUnit}</span>
                          )}
                        </div>
                      )}
                    </div>

                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {item.condition}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 truncate max-w-[140px]">
                      <MapPin className="size-3 shrink-0 text-primary" />
                      <span className="truncate">{item.location}</span>
                    </span>
                    <span className="truncate max-w-[120px] text-right font-medium text-foreground/80">
                      {item.seller}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close modal background"
            onClick={() => setSelectedItem(null)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Listing detail"
            className="glass-rich relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full"
              onClick={() => setSelectedItem(null)}
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <ShoppingBag className="size-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {selectedItem.category} · {selectedItem.type}
                </span>
                <p className="text-xs text-muted-foreground">Listed {selectedItem.posted}</p>
              </div>
            </div>

            <h2 className="mt-4 font-display text-2xl font-bold leading-tight pr-8">
              {selectedItem.title}
            </h2>

            {/* Price Box */}
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-background/50 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Listing Valuation
                </p>
                {selectedItem.type === "Free" ? (
                  <p className="font-display text-2xl font-bold text-amber-500">Free to Claim</p>
                ) : selectedItem.type === "Lend / Borrow" ? (
                  <p className="font-display text-xl font-bold text-purple-500">
                    Lend Duration: {selectedItem.pricingUnit}
                  </p>
                ) : (
                  <p className="font-display text-2xl font-bold text-foreground">
                    ₹{selectedItem.price.toLocaleString("en-IN")}{" "}
                    <span className="text-xs font-normal text-muted-foreground">
                      {selectedItem.pricingUnit !== "one-time" ? selectedItem.pricingUnit : "fixed price"}
                    </span>
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Condition
                </p>
                <span className="inline-block mt-0.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {selectedItem.condition}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Item Description
              </h4>
              <p className="text-sm leading-relaxed text-foreground/90">
                {selectedItem.description}
              </p>
            </div>

            {/* Location & Seller Telemetry */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/30 p-3.5 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <User className="size-3.5 text-primary" />
                  Student Seller
                </span>
                <p className="mt-1 text-muted-foreground">{selectedItem.seller}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{selectedItem.availability}</p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-3.5 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  Campus Meetup Spot
                </span>
                <p className="mt-1 text-muted-foreground">{selectedItem.location}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Meet in public campus areas</p>
              </div>
            </div>

            {/* Safety notice */}
            <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-primary/5 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 shrink-0 text-primary mt-0.5" />
              <p>
                Campus safety guideline: Verify items in person on campus (Library, LT Quad, Canteen) and avoid paying in advance before inspection.
              </p>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
              <Button
                className="rounded-full gap-2"
                onClick={() => setContactSent(true)}
              >
                {contactSent ? (
                  <>
                    <CheckCircle2 className="size-4 text-success" />
                    Interest Marked (Session)
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    {selectedItem.type === "Free"
                      ? "Claim Free Item"
                      : selectedItem.type === "For Rent"
                      ? "Request Rental"
                      : selectedItem.type === "Lend / Borrow"
                      ? "Request to Borrow"
                      : "Contact Seller"}
                  </>
                )}
              </Button>
            </div>
            {contactSent && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Demo notice: In this prototype, interest is noted locally in your session.
              </p>
            )}
          </aside>
        </div>
      )}

      {/* Create Listing Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Create listing"
            className="glass-rich relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Plus className="size-5" />
                </div>
                <h2 className="font-display text-xl font-bold">List Item on Campus</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCreating(false)}
                aria-label="Close"
              >
                <X className="size-4" />
              </Button>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Share or exchange gear with classmates. Saved locally in your browser session.
            </p>

            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Item Title *
                </label>
                <Input
                  required
                  placeholder="e.g. Casio fx-991EX, Hero Cycle, BEE Textbook"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Exchange Type
                  </label>
                  <select
                    aria-label="Listing exchange type"
                    value={form.type}
                    onChange={(e) =>
                      setForm({ ...form, type: e.target.value as MarketplaceListing["type"] })
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Free">Free on Campus</option>
                    <option value="Lend / Borrow">Lend / Borrow</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <select
                    aria-label="Item category"
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value as MarketplaceListing["category"],
                      })
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="Study">Study Gear</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Vehicles">Vehicles & Cycles</option>
                    <option value="Books">Books & Notes</option>
                    <option value="Projects">Projects & Hardware</option>
                    <option value="Hostel">Hostel Essentials</option>
                    <option value="Sports">Sports</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              {form.type !== "Free" && form.type !== "Lend / Borrow" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Price (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="e.g. 500"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pricing Unit
                    </label>
                    <Input
                      placeholder="e.g. one-time, / day, / week"
                      value={form.pricingUnit}
                      onChange={(e) => setForm({ ...form, pricingUnit: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Item Condition
                  </label>
                  <select
                    aria-label="Item condition"
                    value={form.condition}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        condition: e.target.value as MarketplaceListing["condition"],
                      })
                    }
                    className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium"
                  >
                    <option value="Like new">Like new</option>
                    <option value="New">Brand New</option>
                    <option value="Good">Good</option>
                    <option value="Used">Used / Functional</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Campus Location
                  </label>
                  <Input
                    placeholder="e.g. Library, LT-101, Gate 2"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Availability Note
                </label>
                <Input
                  placeholder="e.g. Evenings after 5pm, Weekends"
                  value={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.value })}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </label>
                <Textarea
                  placeholder="Mention key specs, condition, accessories included, and pickup preferences…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="min-h-[90px] rounded-xl text-xs"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="rounded-full">
                  Post Listing (Session)
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
