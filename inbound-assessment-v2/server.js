const express = require("express");
const userRoutes = require("./routes/userRoute");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const upload = multer();
const cluster = require("cluster");
const numberOfWorker = require("os").cpus().length;
//env config
dotenv.config();
const app = express();
//set cross origin middleware
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
app.use(upload.none());

app.use(express.json());
//database config
mongoose
  .connect(
    "mongodb+srv://gaurav:3gANONaT61B5g4RP@cluster0.94qn5u5.mongodb.net/assessment_db_dev",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((response) => {
    console.log("database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.static(path.join(__dirname, "./client/build")));
app.use("/api/user", userRoutes);

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
//setup cluster for Scalling the Application
if (cluster.isMaster) {
  //for worker process
  for (let i = 0; i < numberOfWorker; i++) {
    cluster.fork();
  }
  //Handle worker exists and restart them
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(4000, () => {
    console.log("listening on port 4000");
  });
}
