import { useEffect, useMemo, useState } from "react";

import Navbar from "./components/Navbar.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductModal from "./components/ProductModal.jsx";
import navbar from "./assets/navbar.png";
const API = "https://fakestoreapi.com";

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API}/products/categories`);

        if (!response.ok) {
          throw new Error("Unable to load categories.");
        }

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);

  // Fetch products whenever category changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const endpoint =
          selectedCategory === "all"
            ? `${API}/products`
            : `${API}/products/category/${encodeURIComponent(
                selectedCategory
              )}`;

        const response = await fetch(endpoint, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Something went wrong while loading products.");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load products.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [selectedCategory]);

  // Search and sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result.sort(
        (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0)
      );
    }

    return result;
  }, [products, search, sort]);

  // Add to cart
  function addToCart(product) {
    setCart((previousCart) => {
      const existing = previousCart.find((item) => item.id === product.id);

      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  }

  // Remove item
  function removeFromCart(id) {
    setCart((previousCart) => previousCart.filter((item) => item.id !== id));
  }

  // Change quantity
  function updateQuantity(id, amount) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
      />

      <main>
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">THE NOVA COLLECTION</span>

            <h1>
              Discover Your
              <br />
              <span>Everyday Luxury.</span>
            </h1>

            <p>
              Explore a thoughtfully selected collection of products
              designed to make everyday shopping feel extraordinary.
            </p>

            <a href="#products" className="primary-button">
              Explore Collection <span>↗</span>
            </a>

            <div className="hero-stats">
              <div>
                <strong>20+</strong>
                <small>Products</small>
              </div>

              <div>
                <strong>4.8★</strong>
                <small>Customer rating</small>
              </div>

              <div>
                <strong>100%</strong>
                <small>Online shopping</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle">
              <div className="hero-product">
              <img src={navbar} alt="NOVA Collection" />
              </div>
            </div>

            <div className="floating-label">
              <span>✦</span>
              Curated for you
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="benefits">
          <div>
            <span>✦</span>
            <div>
              <strong>Curated Collection</strong>
              <small>Handpicked products</small>
            </div>
          </div>

          <div>
            <span>◇</span>
            <div>
              <strong>Easy Shopping</strong>
              <small>Simple browsing experience</small>
            </div>
          </div>

          <div>
            <span>♡</span>
            <div>
              <strong>Customer Focused</strong>
              <small>Shopping made convenient</small>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR COLLECTION</span>
              <h2>Explore Products<span>.</span></h2>
              <p>Find something you'll love.</p>
            </div>

            <div className="sort-control">
              <label htmlFor="sort">Sort by</label>

              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="default">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="category-list">
            <button
              className={selectedCategory === "all" ? "active" : ""}
              onClick={() => setSelectedCategory("all")}
            >
              All Products
            </button>

            {categories.map((category) => (
              <button
                key={category}
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Discovering amazing products...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <h3>Oops! Something went wrong.</h3>
              <p>{error}</p>
              <button
                className="primary-button"
                onClick={() => setSelectedCategory("all")}
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try another search or category.</p>
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  onView={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </section>

        {/* CART */}
        <section className="cart-section" id="cart">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR SELECTION</span>
              <h2>Shopping Bag<span>.</span></h2>
              <p>Your selected products are waiting for you.</p>
            </div>

            <span className="cart-count">{cartCount} Items</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>♡</span>
              <h3>Your shopping bag is empty</h3>
              <p>Explore our collection and add something you love.</p>
              <a href="#products" className="primary-button">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                {cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <img src={item.image} alt={item.title} />

                    <div className="cart-item-info">
                      <h3>{item.title}</h3>
                      <strong>${item.price.toFixed(2)}</strong>

                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <h3>Order Summary</h3>

                <div>
                  <span>Items</span>
                  <span>{cartCount}</span>
                </div>

                <div>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div className="total-row">
                  <strong>Total</strong>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>

                <button
                  className="primary-button checkout-button"
                  onClick={() =>
                    alert("This is a demo store. Payment is not connected yet.")
                  }
                >
                  Continue to Checkout ↗
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ABOUT */}
        <section className="about-section" id="about">
          <span className="eyebrow">THE NOVA EXPERIENCE</span>

          <h2>Shopping should feel <span>different.</span></h2>

          <p>
            NOVA STORE brings products together in one simple, elegant
            shopping experience. Discover, explore and find your next
            favourite item.
          </p>

          <a href="#products" className="primary-button">
            Discover NOVA ↗
          </a>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <a href="#" className="logo">
          NOVA<span>.</span>
        </a>

        <p>Thoughtful shopping. Modern experience.</p>

        <small>© 2026 NOVA STORE. All rights reserved.</small>
      </footer>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={addToCart}
      />
    </>
  );
}

export default App;