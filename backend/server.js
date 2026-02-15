const express = require('express');
require('dotenv').config();
const cors = require("cors");
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
require('./db');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://votex-lyart.vercel.app/",
    credentials: true
  })
);
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});


app.use('/candidates', candidateRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
