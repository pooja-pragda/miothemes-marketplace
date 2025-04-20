import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image_url} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <p>${product.price}</p>
      <Link to={`/product/${product._id}`} className="btn btn-primary">View Details</Link>
    </div>
  );
}

export default ProductCard;
