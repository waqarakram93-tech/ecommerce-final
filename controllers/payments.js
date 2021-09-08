import stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';

export const createCheckoutSession = asyncHandler(async (req, res) => {
    const stripeClient = stripe(process.env.STRIPE_KEY);
    const { cart } = req.body
    const line_items = cart.map(item => {
        return {
            images: [item.images[0].url],
            amount: item.price * 100,
            name: item.name,
            currency: "eur",
            description: item.description,
            quantity: item.qty
        }
    })
    const { url } = await stripeClient.checkout.sessions.create({
        line_items,
        payment_method_types: ['card', 'giropay', 'sofort'],
        mode: 'payment',
        success_url: `http://localhost:3000?success=true`,
        cancel_url: `http://localhost:3000?canceled=true`
    });

    res.json({ url });
});