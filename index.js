const express=require('express')
const dotenv=require('dotenv')
const mongoose=require('mongoose')
const app=express()


dotenv.config();
app.use(express.json());


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