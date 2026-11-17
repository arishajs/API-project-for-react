function Navbar({ search, setSearch, cartCount }) {
  return (
    <header className="navbar">
      <a href="#" className="logo">
        NOVA<span>.</span>
      </a>

      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#products">Shop</a>
        <a href="#about">About</a>
      </nav>

      <div className="nav-actions">
        <div className="search-box">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <a href="#cart" className="cart-button">
          ♡ <span>{cartCount}</span>
        </a>
      </div>
    </header>
  );
}

export default Navbar;