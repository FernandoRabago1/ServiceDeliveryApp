const db = require('../models');
const Job = db.Job;
const User = db.User;
const { Op } = require('sequelize'); // For potential future filtering

// Create a new job
exports.createJob = async (req, res) => {
  try {
    // Expect buyer_uid in the request body. dooer_uid is optional.
    const { buyer_uid, dooer_uid, status, scheduled_time, category } = req.body;

    if (!buyer_uid || !category) {
      return res.status(400).json({ error: 'buyer_uid and category are required' });
    }

    // Optional: Validate buyer and dooer exist
    const buyer = await User.findByPk(buyer_uid);
    if (!buyer) {
      return res.status(404).json({ error: 'Buyer user not found' });
    }
    if (dooer_uid) {
        const dooer = await User.findByPk(dooer_uid);
        if (!dooer) {
            return res.status(404).json({ error: 'Dooer user not found' });
        }
    }

    const jobData = {
        buyer_uid,
        dooer_uid: dooer_uid || null, // Ensure null if not provided
        status: status || 'pending', // Default status if not provided
        scheduled_time: scheduled_time || null,
        category
    };

    const job = await Job.create(jobData);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error while creating job' });
  }
};

// Get all jobs (includes buyer and dooer details)
exports.getAllJobs = async (req, res) => {
  try {
    // Include associated users (buyer and dooer) using their aliases
    const jobs = await Job.findAll({
      include: [
        { model: User, as: 'buyer' },
        { model: User, as: 'dooer', required: false } // dooer might be null
      ]
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get job by ID (includes buyer and dooer details)
exports.getJobById = async (req, res) => {
  try {
    const { uid } = req.params;
    const job = await Job.findByPk(uid, {
      include: [
        { model: User, as: 'buyer' },
        { model: User, as: 'dooer', required: false }
      ]
    });
    if (job) {
      res.status(200).json(job);
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update job information
exports.updateJob = async (req, res) => {
  try {
    const { uid } = req.params;
    // Only allow updating specific fields like dooer_uid, status, scheduled_time, review_uid
    const { dooer_uid, status, scheduled_time, review_uid } = req.body;
    const updateData = {};

    if (dooer_uid !== undefined) {
        // Optional: Validate dooer exists if changing/setting it
        if (dooer_uid !== null) {
            const dooer = await User.findByPk(dooer_uid);
            if (!dooer) return res.status(404).json({ error: 'Dooer user not found' });
        }
        updateData.dooer_uid = dooer_uid;
    }
    if (status !== undefined) updateData.status = status;
    if (scheduled_time !== undefined) updateData.scheduled_time = scheduled_time;
    if (review_uid !== undefined) updateData.review_uid = review_uid; // Add validation if Review model exists

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const [updated] = await Job.update(updateData, {
      where: { uid: uid }
    });

    if (updated) {
      const updatedJob = await Job.findByPk(uid, {
        include: [
          { model: User, as: 'buyer' },
          { model: User, as: 'dooer', required: false }
        ]
      });
      res.status(200).json(updatedJob);
    } else {
      const jobExists = await Job.findByPk(uid);
      if (!jobExists) {
        res.status(404).json({ error: 'Job not found' });
      } else {
        // No rows updated, likely because data sent was the same as existing data
         const currentJob = await Job.findByPk(uid, {
            include: [
              { model: User, as: 'buyer' },
              { model: User, as: 'dooer', required: false }
            ]
          });
        res.status(200).json(currentJob); // Return current job state
      }
    }
  } catch (error) {
    console.error('Error updating job:', error);
     if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error while updating job' });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const { uid } = req.params;
    const deleted = await Job.destroy({
      where: { uid: uid }
    });
    if (deleted) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ error: 'Job not found' });
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get jobs by category
exports.getJobsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const jobs = await Job.findAll({
      where: { category },
      include: [
        { model: User, as: 'buyer' },
        { model: User, as: 'dooer', required: false }
      ]
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};