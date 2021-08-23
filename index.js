
import express from 'express';
import categoryRouter from './routes/categoryRouter.js';


const app = express();
const port = process.env.PORT || 5000;

app.use('/categories', categoryRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));