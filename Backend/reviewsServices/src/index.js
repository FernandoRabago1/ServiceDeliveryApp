require('dotenv').config();
const express = require('express');
const app = express();
const reviewRoutes = require('./routes/reviewRoutes');

app.use(express.json());
app.use('/reviews', reviewRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Reviews & Ratings service running on port ${PORT}`);
});
