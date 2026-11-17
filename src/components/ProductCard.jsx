function ProductCard({ product, onAdd, onView }) {
    return (
      <article className="product-card">
        <div className="product-image">
          <span className="product-badge">NOVA PICK</span>
  
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
  
        <div className="product-info">
          <p className="product-category">{product.category}</p>
  
          <h3 title={product.title}>{product.title}</h3>
  
          <div className="product-rating">
            <span>★</span>
            {product.rating?.rate ?? "N/A"}
            <small>({product.rating?.count ?? 0} reviews)</small>
          </div>
  
          <div className="product-bottom">
            <strong>${product.price.toFixed(2)}</strong>
  
            <div className="product-buttons">
              <button className="view-btn" onClick={() => onView(product)}>
                View
              </button>
  
              <button className="add-btn" onClick={() => onAdd(product)}>
                +
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }
  
  export default ProductCard;