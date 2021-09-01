import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import subcategoryRouter from './routes/subcategoryRouter.js';
import productRouter from './routes/productRouter.js';
import orderRouter from './routes/orderRouter.js';
import orderdetailsRouter from './routes/orderdetailsRouter.js';
import errorHandler from './middlewares/errorHandler.js';



const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: process.env.CORS_ORIGIN
    })
);

app.use(express.json());
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);
app.use('/subcategories', subcategoryRouter);
app.use('/products', productRouter);
app.use('/orders', orderRouter);
app.use('/orderdetails', orderdetailsRouter);
app.use(errorHandler)


app.listen(port, () => console.log(`Server running on port ${port}`));