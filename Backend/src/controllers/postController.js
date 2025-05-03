const db = require('../models'); // Import the db object
const Post = db.Post; // Assign Post model
const User = db.User; // Assign User model

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { owner_uid, ...postData } = req.body;
    if (!owner_uid) { 
        return res.status(400).json({ error: 'owner_uid is required to create a post' }); 
    }
    const user = await User.findByPk(owner_uid); 
    if (!user) {
        return res.status(404).json({ error: 'Owner user not found' }); 
    }
    const post = await Post.create({ ...postData, owner_uid: owner_uid }); 

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error); // Mantén esto
    // Añade logs detallados
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.original) {
        console.error('Original DB Error:', error.original);
    }
    if (error.errors) { // Para errores de validación
        console.error('Validation Errors:', error.errors.map(e => e.message));
    }

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
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