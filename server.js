const express = require("express");
const cors = require("cors");
const cluster = require("cluster");

//To get access to local .env file's variable
require("dotenv").config();

//Creating Express application
const app = express();

const port = process.env.PORT || 3000;
const instances = process.env.NUMBER_OF_INSTANCES || 2;

//Allowing Angular app to access the Node apis
app.use(
  cors({
    origin: process.env.ANGULAR_APP,
  })
);

//Checking if current process is Master or not
//If it is master then Fork process with number of instances
//Else Start Configuration and Start server
if (cluster.isMaster) {
  //Creating number of instances
  for (let i = 0; i < instances; i++) {
    cluster.fork();
  }

  //If process got exited then create new Instance
  //It will run number of node application instances at anytime (fail safe)
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker:${worker.process.pid} got exited . New Instance will be created`
    );
    cluster.fork();
  });
} else {
  //Application Configuration------------------------------

  //Connecting to Database
  require("./configs/database");

  //loading Models
  require("./model/user");
  require("./model/knowledgeContent");

  //Initializing Passport
  const passport = require("./helpers/passport");
  app.use(passport.initialize());

  //paring json data to body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //Using Central Router
  app.use("/", require("./routers"));

  //Handling Errors at application level
  app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
  });
  process.on("unhandledRejection", (error) => {
    console.log(error);
    process.exit(0);
  });

  //Starts to listen to requests
  app.listen(port, () => {
    console.log(`Application is listening on ${port} ${process.pid}`);
  });
}
