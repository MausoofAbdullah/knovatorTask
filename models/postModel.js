const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    createdBy:{
      type:String,
      required:true,
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isActive:{
        type:Boolean,
            default:true
    },
    geoLocation: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: [0, 0], // Default to [0, 0] if no coordinates are provided
        },
      },
   
  },
  { timestamps: true }
);

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;