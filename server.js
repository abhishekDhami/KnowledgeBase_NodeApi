const express = require("express");
const cors = require("cors");

//To get access to local .env file's variable
require("dotenv").config();

//Creating Express application
const app = express();

const port = process.env.PORT || 3000;

//Allowing Angular app to access the Node apis
app.use(
  cors({
    origin: process.env.ANGULAR_APP,
  })
);

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
  console.log(`Application is listening on ${port}`);
});
