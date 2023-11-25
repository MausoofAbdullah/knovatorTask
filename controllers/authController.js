const UserModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require("jsonwebtoken");
const opts=require('../store/config.js')


const { validationResult } = require('express-validator');
;

const {
  generateHashedPassword,
  generateServerErrorCode,
  registerValidation,
  loginValidation,
} = require('../store/util.js');

// const {
//   SOME_THING_WENT_WRONG,
//   USER_EXISTS_ALREADY,
//   WRONG_PASSWORD,
//   USER_DOES_NOT_EXIST,
// } = require('../store/constant');

module.exports = {

  //Registering user
  registerUser: [registerValidation,async (req, res) => {
    const errorsAfterValidation = validationResult(req);
    if (!errorsAfterValidation.isEmpty()) {
        return res.status(400).json({
          code: 400,
          errors: errorsAfterValidation.mapped(),
        });
      } 
   const hashedPassword= generateHashedPassword(req.body.password)
   req.body.password=hashedPassword
   
   const newUser = new UserModel(req.body);
   const {username}=req.body
  
    //console.log(req.body,"what is in it")

    try {
      const oldUser = await UserModel.findOne({ username });

      if (oldUser) {
        return res
          .status(400)
          .json({ message: "username is already registered" });
      }

      const user = await newUser.save();

    //   const token = jwt.sign(
    //     {
    //       username: user.username,
    //       id: user._id,
    //     },
    //     process.env.JWT_KEY,
    //     { expiresIn: "1h" }
    //   );
      const { password, ...others } = user._doc;

      res.status(200).json({ ...others, message: "user registered" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }],

  login:[loginValidation, async (req, res) => {
    const errorsAfterValidation = validationResult(req);
  if (!errorsAfterValidation.isEmpty()) {
    return res.status(400).json({
      code: 400,
      errors: errorsAfterValidation.mapped(),
    });
  } 
    const { username, password } = req.body;
    try {
      const user = await UserModel.findOne({ username: username });
      if (user) {
        const validity = await bcrypt.compare(password, user.password);

        // validity?res.status(200).json(user):res.status(400).json("wrong Password")
        if (!validity) {
          res.status(400).json("wrong password");
        } else {
            const token = jwt.sign({ sub: user.id }, opts.secretOrKey);
            res.json({ message: 'Login successful', token });
          const { password, ...others } = user._doc;
          res.status(200).json({ others, token, message: "login successful" });
        }
      } else {
        res.status(400).json("user does not exist");
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }],
};
