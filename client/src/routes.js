import HomePage from './HomePage';
import ProductPage from './ProductPage';

const routes = [
  { path: "/", element: <HomePage /> },
  { path: "/product/:id", element: <ProductPage /> }
];

export default routes;
