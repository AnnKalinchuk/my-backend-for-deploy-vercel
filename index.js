const express = require("express");
const mongoose = require("mongoose");

const todoAuthRouters = require("./routes/todoAuthRoutes.js");
const todoRouters = require("./routes/todoRouters.js")

require("dotenv").config();

const app = express();

const dbUrl = process.env.MONGODB_URI
const PORT = process.env.PORT


const corsMiddleware = require('./middleware/corsMiddleware.js')

app.use(corsMiddleware)
app.use(express.json())


app.use("/api/todos/auth", todoAuthRouters);
app.use("/api/todos", todoRouters)


const start = async () => {
  try {
    await mongoose.connect(dbUrl);

    app.listen(PORT, () => {
      console.log("server started on port", PORT);
    });
  } catch (err) {
    console.error(`Error connection to mongo: ${dbUrl}`, err);
  }
};

start();
