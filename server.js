const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/candidates', candidateRoutes);
app.use('/users',  userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
