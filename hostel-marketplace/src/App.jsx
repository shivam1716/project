import React, { useMemo, useState } from "react";
import "./App.css";

const CATEGORIES = ["All", "Cycles", "Books", "Mattress", "Electronics", "Other"];

const initialItems = [
  {
    id: crypto.randomUUID(),
    title: "Used Cycle (26 inch)",
    category: "Cycles",
    price: 4500,
    condition: "Good",
    contactName: "Rahul",
    contactPhone: "9876543210",
    postedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    imageColor: "#22c55e",
    description: "Includes helmet and lock. Lightly used.",
  },
  {
    id: crypto.randomUUID(),
    title: "Maths Books - Semester 2",
    category: "Books",
    price: 1200,
    condition: "Very Good",
    contactName: "Neha",
    contactPhone: "9123456780",
    postedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    imageColor: "#60a5fa",
    description: "Crisp pages, no notes inside.",
  },
  {
    id: crypto.randomUUID(),
    title: "Double Mattress (Medium Soft)",
    category: "Mattress",
    price: 3200,
    condition: "Good",
    contactName: "Arjun",
    contactPhone: "9988776655",
    postedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    imageColor: "#f97316",
    description: "Clean and comfortable. Pickup from hostel gate.",
  },
];

function formatMoney(n) {
  try {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(n);
  }
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function App() {
  const [items, setItems] = useState(initialItems);

  // Filters
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(""); 
  const [sortBy, setSortBy] = useState("newest"); 

  // Form
  const [form, setForm] = useState({
    title: "",
    category: "Cycles",
    price: "",
    condition: "Good",
    contactName: "",
    contactPhone: "",
    description: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const priceLimit = maxPrice === "" ? null : Number(maxPrice);

    let result = items.filter((it) => {
      const matchesQuery =
        q.length === 0 ||
        it.title.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.contactName.toLowerCase().includes(q);

      const matchesCategory = category === "All" ? true : it.category === category;

      const matchesPrice = priceLimit == null ? true : Number(it.price) <= priceLimit;

      return matchesQuery && matchesCategory && matchesPrice;
    });

    if (sortBy === "newest") {
      result = [...result].sort((a, b) => b.postedAt - a.postedAt);
    } else if (sortBy === "priceAsc") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "priceDesc") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    return result;
  }, [items, query, category, maxPrice, sortBy]);

  function onChangeForm(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function resetForm() {
    setForm({
      title: "",
      category: "Cycles",
      price: "",
      condition: "Good",
      contactName: "",
      contactPhone: "",
      description: "",
    });
  }

  function getCategoryColor(cat) {
    switch (cat) {
      case "Cycles":
        return "#22c55e";
      case "Books":
        return "#60a5fa";
      case "Mattress":
        return "#f97316";
      case "Electronics":
        return "#a78bfa";
      default:
        return "#e5e7eb";
    }
  }

  function addItem(e) {
    e.preventDefault();

    const title = form.title.trim();
    const price = Number(form.price);
    const contactName = form.contactName.trim();
    const contactPhone = form.contactPhone.trim();
    const description = form.description.trim();

    if (!title) return alert("Please enter item title.");
    if (!Number.isFinite(price) || price <= 0) return alert("Please enter a valid price.");
    if (!contactName) return alert("Please enter contact name.");
    if (!contactPhone) return alert("Please enter contact phone number.");

    const newItem = {
      id: crypto.randomUUID(),
      title,
      category: form.category,
      price,
      condition: form.condition,
      contactName,
      contactPhone,
      postedAt: Date.now(),
      imageColor: getCategoryColor(form.category),
      description: description || "No description provided.",
    };

    setItems((prev) => [newItem, ...prev]);
    resetForm();
  }

  function clearFilters() {
    setQuery("");
    setCategory("All");
    setMaxPrice("");
    setSortBy("newest");
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header__left">
          <div className="logo" aria-hidden="true">
            <span className="logo__dot" />
          </div>
          <div>
            <h1 className="title">Hostel Marketplace</h1>
            <p className="subtitle">Buy/Sell essentials as seniors leave — for juniors who need stuff.</p>
          </div>
        </div>

        <div className="header__right">
          <div className="pill">
            <span className="pill__label">Total listings</span>
            <span className="pill__value">{items.length}</span>
          </div>
        </div>
      </header>

      <main className="layout">
        {/* Filters + list */}
        <section className="panel">
          <div className="panel__header">
            <h2 className="panel__title">Browse Listings</h2>
            <div className="panel__actions">
              <button className="btn btn--ghost" onClick={clearFilters} type="button">
                Clear
              </button>
            </div>
          </div>

          <div className="filters">
            <div className="field">
              <label className="label">Search</label>
              <input
                className="input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., cycle, books, mattress, Rahul..."
              />
            </div>

            <div className="field">
              <label className="label">Category</label>
              <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label">Max Price (optional)</label>
              <input
                className="input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g., 2000"
                inputMode="numeric"
              />
            </div>

            <div className="field">
              <label className="label">Sort</label>
              <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="listMeta">
            <span className="muted">
              Showing <b>{filtered.length}</b> of {items.length}
            </span>
          </div>

          <div className="grid">
            {filtered.map((it) => (
              <article key={it.id} className="card">
                <div className="card__media" style={{ background: it.imageColor }}>
                  <div className="card__tag">{it.category}</div>
                </div>

                <div className="card__body">
                  <h3 className="card__title">{it.title}</h3>

                  <div className="card__row">
                    <span className="price">₹{formatMoney(it.price)}</span>
                    <span className="cond">{it.condition}</span>
                  </div>

                  <p className="card__desc">{it.description}</p>

                  <div className="card__contact">
                    <div className="contactLine">
                      <span className="contactLabel">Contact:</span> <b>{it.contactName}</b>
                    </div>
                    <div className="contactLine">
                      <span className="contactLabel">Phone:</span> <b>{it.contactPhone}</b>
                    </div>
                    <div className="contactLine muted">
                      Posted: <b>{formatDate(it.postedAt)}</b>
                    </div>
                  </div>

                  <div className="card__footer">
                    <a
                      className="btn btn--primary"
                      href={`tel:${it.contactPhone}`}
                      aria-label={`Call ${it.contactName}`}
                    >
                      Call
                    </a>
                    <button
                      className="btn btn--ghost"
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(it.contactPhone);
                        alert("Phone number copied (if clipboard permission allows).");
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="empty">
                <div className="empty__title">No results</div>
                <div className="empty__text">Try adjusting your filters or search terms.</div>
              </div>
            )}
          </div>
        </section>

        {/* Post form */}
        <aside className="panel panel--form">
          <div className="panel__header">
            <h2 className="panel__title">Post an Item</h2>
            <div className="panel__actions">
              <span className="badge">Buy/Sell</span>
            </div>
          </div>

          <form className="form" onSubmit={addItem}>
            <div className="field">
              <label className="label">Item Title</label>
              <input
                className="input"
                name="title"
                value={form.title}
                onChange={onChangeForm}
                placeholder="e.g., Used Cycle, Books, Mattress..."
              />
            </div>

            <div className="twoCols">
              <div className="field">
                <label className="label">Category</label>
                <select className="select" name="category" value={form.category} onChange={onChangeForm}>
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="label">Condition</label>
                <select className="select" name="condition" value={form.condition} onChange={onChangeForm}>
                  {["New", "Very Good", "Good", "Fair"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label className="label">Price</label>
              <input
                className="input"
                name="price"
                value={form.price}
                onChange={onChangeForm}
                placeholder="e.g., 2000"
                inputMode="numeric"
              />
            </div>

            <div className="field">
              <label className="label">Contact Name</label>
              <input
                className="input"
                name="contactName"
                value={form.contactName}
                onChange={onChangeForm}
                placeholder="e.g., Shivam"
              />
            </div>

            <div className="field">
              <label className="label">Contact Phone</label>
              <input
                className="input"
                name="contactPhone"
                value={form.contactPhone}
                onChange={onChangeForm}
                placeholder="e.g., 9217053112"
                inputMode="tel"
              />
            </div>

            <div className="field">
              <label className="label">Description</label>
              <textarea
                className="textarea"
                name="description"
                value={form.description}
                onChange={onChangeForm}
                rows={4}
                placeholder="Add details like size, chapters, pickup location, etc."
              />
            </div>

            <button className="btn btn--primary btn--block" type="submit">
              Publish Listing
            </button>

            <div className="hint">
              Tip: This is a demo app—listings are stored in memory, so refreshing the page will reset them.
            </div>
          </form>
        </aside>
      </main>

      <footer className="footer">
        <span className="muted">
          Made for hostel juniors. Post essentials. Find deals. Keep it simple.
        </span>
      </footer>
    </div>
  );
}
