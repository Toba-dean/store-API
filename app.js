const express = require('express');
const app = express();
const PORT = 3000;
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const productsRouter = require('./routes/products');
require('dotenv').config();
require('express-async-errors');

// parsing data
app.use(express.json());

// Routes 
app.get('/', (req, res) => {
  const text = '<h1>STORE API</h1>';
  const link = `<a href='/api/v1/products'>Products</a>`
  res.status(200).send(`${text} ${link}`);
})

app.use('/api/v1/products', productsRouter);


// Middleware
app.use(notFound);
app.use(errorHandler);


const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server listening at port:${PORT}`);
    })
  } catch (error) {
    console.log(error.message);
  }
} 
  
start();