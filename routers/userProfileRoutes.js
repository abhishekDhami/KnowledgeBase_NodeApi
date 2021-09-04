const router = require("express").Router();
const mongoose = require("mongoose");
const Users = mongoose.model("Users");
const sanitize = require("mongo-sanitize");
const utils = require("../helpers/utils");
const { verifyAccount } = require("../helpers/googleAuth");

//Handling Login route, for authenticating existing user
router.post("/login", (req, res, next) => {
  try {
    let { username, password } = req.body;

    //Validating input
    if (!username || !password)
      return res.status(400).json({ success: false, msg: "Invalid Input!" });

    //sanitizing user input before executing in mongodb
    username = sanitize(username);

    //Finding user with username entered by user
    Users.findOne({ $or: [{ username: username }, { email: username }] })
      .then((user) => {
        if (!user)
          return res
            .status(401)
            .json({ success: false, msg: "Unauthorized Access" });

        //Validating password
        let isValid = utils.validPassword(password, user.hash, user.salt);

        if (isValid) {
          let tokenObj = utils.issueJWT(user);
          let userObj = { username: user.username, email: user.email };
          return res.json({
            success: true,
            token: tokenObj.token,
            user: userObj,
          });
        } else {
          return res
            .status(401)
            .json({ success: false, msg: "Password is incorrect" });
        }
      })
      .catch((err) => {
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

//Registering new user, storing user details in database
router.post("/register", (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    //Validating input
    if (!username || !password || !email)
      return res.status(400).json({ success: false, msg: "Invalid Input!" });

    //Generating salt and hash
    let { salt, hash } = utils.generatePassword(password);
    username = sanitize(username);
    email = sanitize(email);
    let newUser = new Users({
      username,
      hash,
      salt,
      email,
    });

    //Saving new User
    newUser
      .save()
      .then((user) => {
        //issuing JWT token for new User
        let tokenObj = utils.issueJWT(user);
        return res.json({
          success: true,
          user: { username: user.username, email: user.email },
          token: tokenObj.token,
        });
      })
      .catch((err) => {
        if (err.code === 11000)
          return res
            .status(400)
            .json({ success: false, msg: "Username Already Exists" });
        next(err);
      });
  } catch (err) {
    next(err);
  }
});

//Authenticating Google account
router.post("/authSocialUser", (req, res, next) => {
  let token = req.body.idToken;
  if (!token)
    return res
      .status(400)
      .json({ success: false, msg: "Provide proper input!" });

  //Verifying idToken with help of Google verifyaccount api
  verifyAccount(token)
    .then((emailid) => {
      //If token is valid then checking if user is alredy registered or not
      //If user exists then return jwtToken, otherwise return 401 code
      Users.findOne({ email: emailid }).then((user) => {
        if (!user)
          return res
            .status(401)
            .json({ success: false, msg: "Unauthorized Access" });

        let tokenObj = utils.issueJWT(user);
        let userObj = { username: user.username, email: user.email };
        return res.json({
          success: true,
          token: tokenObj.token,
          user: userObj,
        });
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(400).json({ success: false, msg: "Invalid Token" });
    });
});

module.exports = router;
