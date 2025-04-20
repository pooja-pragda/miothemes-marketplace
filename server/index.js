import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import stripe from 'stripe';
import Product from './models/Product.js';  // Add Product model import

const stripeKey = stripe(process.env.STRIPE_SECRET_KEY);  // Stripe secret key


const app = express();

app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.log('Error connecting to MongoDB:', err);
});

// Simple route
app.get('/', (req, res) => {
    res.send('Miothemes Marketplace Backend');
});

// Route to create payment intent
app.post('/checkout/:productId', async (req, res) => {
    const { productId } = req.params;
    const { token } = req.body;

    try {
        // Get product details from DB (you can change this as per your data structure)
        const product = await Product.findById(productId);
        const price = product.price * 100;  // Stripe expects price in cents

        // Create a payment intent
        const paymentIntent = await stripeKey.paymentIntents.create({
            amount: price,
            currency: 'usd',  // Change currency if needed
            description: product.title,
            receipt_email: token.email,  // Email from Stripe token
        });

        // Send client secret back to the frontend
        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating payment intent');
    }
});

// ✅ Route to fetch all products from the database
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();  // Ensure this returns an array
        res.json(products);  // Ensure the response is an array
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
