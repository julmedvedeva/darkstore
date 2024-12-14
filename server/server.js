
const express = require('express');
const cors = require('cors');
const goodRoutes = require('./routes/good.router');
const orderRoutes = require('./routes/order.router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/api/goods', goodRoutes);
app.use('/api/orders', orderRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
