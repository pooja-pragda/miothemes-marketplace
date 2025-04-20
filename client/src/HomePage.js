import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from backend
    axios.get('http://localhost:5050/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to Miothemes Marketplace</h1>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
