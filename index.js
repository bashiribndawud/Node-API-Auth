const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const authRoutes = require("./routes/auth");
const postRoutes = require('./routes/post')

// Connect to DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () =>
  console.log("Connected to DB")
);

// Middlewares
app.use(express.json())



// Routes middleware
app.use('/api/user',authRoutes);
app.use("/api/post", postRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is up and running`)
})