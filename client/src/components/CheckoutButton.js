import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';

function CheckoutButton({ productId }) {
    const [loading, setLoading] = useState(false);

    const handleToken = async (token) => {
        setLoading(true);

        try {
            // Call backend to create payment intent
            const response = await axios.post(`http://localhost:5000/checkout/${productId}`, { token });
            const { clientSecret } = response.data;

            // Now that we have the client secret, you can proceed with the payment
            const stripe = window.Stripe('your_publishable_stripe_key');
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: token.card,
                    billing_details: {
                        name: token.card.name,
                        email: token.email,
                    },
                },
            });

            if (error) {
                console.log(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                alert('Payment successful!');
                // Handle successful payment (e.g., update order status in DB)
            }
        } catch (error) {
            console.error(error);
            alert('Error processing payment');
        }

        setLoading(false);
    };

    return (
        <div>
            <StripeCheckout
                stripeKey="pk_live_51RFad6JKIp8LjiFShxinNne189Go1M3AdCxhDBM6tDJe3JGBWQR05BNZ2N0JzJBkL0yq9UZd9kcFm32Lx79Wssm1000IYeLSNj"  // Replace with your Stripe public key
                token={handleToken}
                amount={1000}  // Replace with product price in cents
                name="Miothemes Product"
                currency="USD"
                email="customer@example.com"  // Can be passed dynamically
                description="Product Description"
            />
            {loading && <p>Processing payment...</p>}
        </div>
    );
}

export default CheckoutButton;
