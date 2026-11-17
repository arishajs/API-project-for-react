function ProductModal({ product, onClose, onAdd }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="modal-details">
          <span className="product-category">{product.category}</span>

          <h2>{product.title}</h2>

          <div className="product-rating">
            <span>★</span> {product.rating?.rate ?? "N/A"}
            <small>({product.rating?.count ?? 0} reviews)</small>
          </div>

          <h3 className="modal-price">${product.price.toFixed(2)}</h3>

          <p>{product.description}</p>

          <button
            className="primary-button"
            onClick={() => {
              onAdd(product);
              onClose();
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;