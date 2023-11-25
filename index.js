const express=require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const passport=require('passport')
const JwtStrategy = require('passport-jwt').Strategy;

const opts=require('./store/config')



const app=express()


dotenv.config();

// Apply strategy to passport

app.use(express.json());


passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        UserModel.findOne({ email: payload.email }, (err, user) => {
            if (err) return done(err, false);
            if (user) {
              return done(null, {
                email: user.email,
                _id: user[underscoreId]
              });
            }
      return done(null, { id: jwt_payload.sub });
    })}
  ));


  app.use(passport.initialize());
const authRoute = require("./routes/authRoute.js");
const postRoute=require("./routes/postRoute.js")

app.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'You have access to this protected route!' });
  });

app.use('/auth',authRoute)
app.use('/post',postRoute)

// setting of node app and mongoose connectivity

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(console.log("Connected to database"))
  .catch((err) => console.log(err));

  app.listen("3000", () => {
    console.log("server connected");
  });

