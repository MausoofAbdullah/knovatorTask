const express=require('express')
const router = express.Router()
const authentication=require('../middleware/authKMiddleware.js')

const postController = require('../controllers/postController.js');


router.post('/createPost',authentication,postController.createPost)
router.get('/all-posts',postController.getAllPosts)
router.put('/update-posts/:id',authentication,postController.updatePosts)
router.get('/single-post/:id',postController.getSinglePost)
router.delete('/delete-post/:id',authentication,postController.deletePost)
router.get('/getstats',postController.getDashboardStats)


module.exports = router;