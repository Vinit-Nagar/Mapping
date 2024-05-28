const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
require('dotenv').config();


const pinRoute = require("./routes/pins");
const userRoute = require("./routes/users");

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

app.use("/api/users", userRoute);
app.use("/api/pins", pinRoute);

app.listen(process.env.PORT, () => {
  console.log("backend is running");
});
