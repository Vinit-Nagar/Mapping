const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const pinRoute = require("./routes/pins");

mongoose
  .connect("mongodb://127.0.0.1:27017/pin")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));


  app.use('/api/pins/',pinRoute)

app.listen(3000, () => {
  console.log("backend is running");
});
