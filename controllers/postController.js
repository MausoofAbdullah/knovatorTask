const postModel = require("../models/postModel.js");
const { validationResult, check } = require('express-validator');

module.exports = {

    //create blogs
  createPost:[ check('title').notEmpty().withMessage('Title is required'),
  check('body').notEmpty().withMessage('Body is required'),
  check('createdBy').notEmpty().withMessage('CreatedBy is required'),
  check('user').notEmpty().withMessage('User is required'),
  check('geoLocation.type').notEmpty().withMessage('GeoLocation type is required'),
  check('geoLocation.coordinates').isArray().withMessage('GeoLocation coordinates must be an array'), async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    console.log(req.body, "ffffffffff");
    console.log(req.user,"tokenreq")
   
  

    const newPost = new postModel(req.body);

    try {
      await newPost.save();

      res.status(200).json({ newPost, message: "blog created" });
    } catch (error) {
      res.status(500).json(error);
    }
  }],


  getAllPosts: async (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;
    const sortBy = req.query.sortBy || "createdAt";
    const latitude = parseFloat(req.query.latitude) || 0;
    const longitude = parseFloat(req.query.longitude) || 0;
    const maxDistance = parseFloat(req.query.maxDistance) || 10000;
    try {
      const sortOptions = {};
      if (sortBy === "createdAt") {
        sortOptions.createdAt = -1;
      } else if (sortBy === "authorName") {
        sortOptions.authorName = 1;
      }
      const posts = await postModel
        .find({
            geoLocation: {
                $near: {
                  $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude],
                  },
                  $maxDistance: maxDistance,
                },
              },
              isActive: true,
        })
        .populate({ path: "user", select: "-password" })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort(sortOptions);

      console.log(posts, "blog list all");

      if (!posts || posts.length === 0) {
        return res.status(200).json({
          success: false,
          message: "No posts Found",
        });
      }

      return res.status(200).json({
        postCount: posts.length,
        message: "All posts lists",
        posts,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error WHile Getting posts",
        error,
      });
    }
  },

  //update posts
  
      updatePosts: async (req, res) => {
    const psotId = req.params.id;
    const user = req.user.id;
    try {
      const posst = await postModel.findById(postId);
      console.log(post, "poata");

      if (post.user.toString() === user) {
        await post.updateOne({ $set: req.body });

        res.status(200).json("post updated");
      } else {
        res.status(403).json("action forbidden");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },


  //get single blog
  getSinglePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await postModel.findById(id);
      if (!post) {
        return res.status(404).json({
          message: "no posts for this user",
        });
      }
      return res.status(200).send({
        message: "single posts",
        posts,
      });
    } catch (error) {
      return res.status(400).json({
        message: "error while getting single posts",
        error,
      });
    }
  },


  //delete posts
  deletePost: async (req, res) => {
    const postId = req.params.id;
    const user = req.user.id;

    try {
      const post = await postModel.findById(postId);
      if (post.user.toString() === user) {
        await postModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
          message: "post Deleted!",
        });
      } else {
        res.status(403).json("action forbidden");
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: "Erorr WHile Deleteing BLog",
        error,
      });
    }
  },
  getDashboardStats: async (req, res) => {
    try {
      const activePostCount = await postModel.countDocuments({ isActive: true });
      const inactivePostCount = await postModel.countDocuments({ isActive: false });
  
      return res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        activePostCount,
        inactivePostCount,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error while retrieving dashboard statistics",
        error,
      });
    }
  },
};

