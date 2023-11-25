const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const passport=require('passport')


dotenv.config();
const secret = process.env.JWT_KEY;

const authMiddleware = async (req, res, next) => {
  // try {
  //   const token = req.headers.authorization.split(" ")[1];
  //   if (!token) {
  //     return res
  //       .status(401)
  //       .json({ message: "Authentication failed: No token provided." });
  //   }

  //   const decoded = jwt.verify(token, secret);

  //   if (decoded) {
  //     req.user = decoded;
  //   } else {
  //     throw new Error("Invalid token");
  //   }
    // req.body._id=decoded?.id
try{

  passport.authenticate('jwt', { session: false }), (req, res) => {
   res.json({ message: 'You have access to this protected route!' });

    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token." });
  }
};
module.exports = authMiddleware;
