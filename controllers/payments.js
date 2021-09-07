import stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';

export const createCheckoutSession = asyncHandler(async (req, res) => {
    const stripeClient = stripe(process.env.STRIPE_KEY);
    const { url } = await stripeClient.checkout.sessions.create({
        line_items: [
            {
                images: ["https://cdn.vega-direct.com/images/600x600/45cce849/45cce8492b2f4d55/45cce8492b2f4d559f0dff43/45cce8492b2f4d559f0dff43bcc0f776/PU6120FS028_305392_2019-07-15_13-34-38.JPG"],
                amount: 2500,
                name: 'Knife',
                "currency": "eur",
                "description": "Test",
                "quantity": 1
            },
            {
                images: ["https://cdn.vega-direct.com/images/600x600/45cce849/45cce8492b2f4d55/45cce8492b2f4d559f0dff43/45cce8492b2f4d559f0dff43bcc0f776/PU6120FS028_305392_2019-07-15_13-34-38.JPG"],
                amount: 2500,
                name: 'Knife2',
                "currency": "eur",
                "description": "Test2",
                "quantity": 1
            }
        ],
        payment_method_types: ['card', 'giropay', 'sofort'],
        mode: 'payment',
        success_url: `http://localhost:3000?success=true`,
        cancel_url: `http://localhost:3000?canceled=true`
    });

    res.json({ url });
});