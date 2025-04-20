import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CheckoutButton from './components/CheckoutButton';

function ProductPage({ match }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details from backend
    axios.get(`http://localhost:5000/products/${match.params.id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, [match.params.id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h1>{product.title}</h1>
      <img src={product.image_url} alt={product.title} />
      <p>{product.description}</p>
      <h3>${product.price}</h3>
      <CheckoutButton productId={product._id} />
    </div>
  );
}

export default ProductPage;
