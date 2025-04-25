const db = require('../models'); // Import the db object
const Post = db.Post; // Assign Post model
const User = db.User; // Assign User model


// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { user_uid, ...postData } = req.body; // Keep extracting user_uid from request
    if (!user_uid) {
        return res.status(400).json({ error: 'user_uid is required to create a post' });
    }
    const user = await User.findByPk(user_uid);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    // Pass the user's uid under the correct foreign key field name 'owner_uid'
    const post = await Post.create({ ...postData, owner_uid: user_uid }); // Use owner_uid here
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error); // Check logs for detailed error
    res.status(500).json({ error: 'Internal server error while creating post' });
  }
};

// Get all posts (optional, add pagination/filtering as needed)
exports.getAllPosts = async (req, res) => {
  try {
      // Specify the model and the alias used in the association
      const posts = await Post.findAll({
          include: [{
              model: User,
              as: 'owner' // Use the alias defined in models/index.js
          }]
      });
      res.status(200).json(posts);
  } catch (error) {
      console.error('Error fetching posts:', error); // Check logs if error persists
      res.status(500).json({ error: 'Internal server error' });
  }
};


// Get post by ID
exports.getPostById = async (req, res) => {
  try {
    const { uid } = req.params;
    // Also specify the alias here for consistency and clarity
    const post = await Post.findByPk(uid, {
        include: [{
            model: User,
            as: 'owner' // Use the alias here too
        }]
     });
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update post information
exports.updatePost = async (req, res) => {
  try {
    const { uid } = req.params;
    const { user_uid, ...updateData } = req.body; // user_uid is ignored by Post.update

    const [updated] = await Post.update(updateData, {
      where: { uid: uid }
    });

    if (updated) {
      // Fetch the updated post including the owner using the alias
      const updatedPost = await Post.findByPk(uid, {
          include: [{ model: User, as: 'owner' }] // <-- Use alias here
      });
      // Check if findByPk actually found the post (it should if updated > 0)
      if (updatedPost) {
          res.status(200).json(updatedPost);
      } else {
          // Should not happen if updated > 0, but handle defensively
          res.status(404).json({ error: 'Post not found after update' });
      }
    } else {
      // If updated is 0, check if the post exists at all
      const postExists = await Post.findByPk(uid, {
          // Include owner here too if returning the current post
          include: [{ model: User, as: 'owner' }] // <-- Use alias here too
      });
      if (!postExists) {
          res.status(404).json({ error: 'Post not found' });
      } else {
          // Post exists but nothing was updated (e.g., same data sent)
          // Return the current state of the post
          res.status(200).json(postExists); // Return the post found by findByPk
      }
    }
  } catch (error) {
    console.error('Error updating post:', error); // Check logs for detailed error
    res.status(500).json({ error: 'Internal server error while updating post' });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { uid } = req.params; // Use uid as defined in postRoutes.js
    // Use Post directly
    const deleted = await Post.destroy({
      where: { uid: uid } // Use uid for where clause
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};