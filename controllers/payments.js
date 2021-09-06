import stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';

export const createCheckoutSession = asyncHandler(async (req, res) => {
    const stripeClient = stripe(process.env.STRIPE_KEY);
    const { url } = await stripeClient.checkout.sessions.create({
        line_items: [
            {
                price: 'price_1JWgqyDQgxuUeo0yz3xpBDo1',
                quantity: 1
            }
        ],
        payment_method_types: ['card', 'giropay', 'sofort'],
        mode: 'payment',
        success_url: `http://localhost:3000?success=true`,
        cancel_url: `http://localhost:3000?canceled=true`
    });

    res.json({ url });
});