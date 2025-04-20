import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  url: String,
  img: String,
  price: { type: Number, required: true }, // Price is now a number
  description: { type: String, required: false }, // Make description optional
});

const Product = mongoose.model('Product', productSchema);

export default Product;
