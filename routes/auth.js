const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if user already exist
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already Exist");
  }

  // Hash user Password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const user = await newUser.save();
    res.status(201).send({ user: user._id });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  // check if email exist
  const user = await User.findOne({ email: req.body.email });
  console.log(user)
  if (!user) {
    res.status(400).send("Email does not exist");
  }

  // check if password is correct
  const validPassword = await bcryptjs.compare(
    req.body.password,
    user.password
  );
  if(!validPassword) return res.status(400).send('Invalid Password')

  // Create and assign jsonwebtoken (remember that user is logged In)
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token)
  

});



module.exports = router;
