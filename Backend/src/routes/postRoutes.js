const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// Route to create a new post
router.post('/posts', postController.createPost);

// Route to get all posts
router.get('/posts', postController.getAllPosts);

// Route to get a post by ID 
router.get('/posts/:uid', postController.getPostById);

// Route to update post information 
router.put('/posts/:uid', postController.updatePost);

// Route to delete a post
router.delete('/posts/:uid', postController.deletePost);

module.exports = router;
