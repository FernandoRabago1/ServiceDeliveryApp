const db = require('../models');
const Review = db.Review;
const Job = db.Job;
const User = db.User;

// Create a new review for a completed job
exports.createReview = async (req, res) => {
  try {
    const { job_uid, rating, review_text } = req.body;
    const reviewer_uid = req.body.reviewer_uid; // Assuming reviewer UID is sent in body

    if (!job_uid || !rating || !reviewer_uid) {
      return res.status(400).json({ error: 'job_uid, reviewer_uid, and rating are required' });
    }

    // 1. Find the job and ensure it's completed and hasn't been reviewed yet
    const job = await Job.findByPk(job_uid, { include: [{ model: Review, as: 'review' }] });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.status !== 'completed') {
      return res.status(400).json({ error: 'Job must be completed to be reviewed' });
    }
    if (job.review) {
        return res.status(400).json({ error: 'Job has already been reviewed' });
    }
    // 2. Validate reviewer is the buyer and get the dooer (reviewed user)
    if (job.buyer_uid !== reviewer_uid) {
        return res.status(403).json({ error: 'Only the job buyer can review this job' });
    }
    const reviewed_uid = job.dooer_uid;
    if (!reviewed_uid) {
        return res.status(400).json({ error: 'Cannot review a job without an assigned dooer' });
    }

    // 3. Create the review
    const reviewData = {
      job_uid,
      reviewer_uid,
      reviewed_uid,
      rating,
      review_text: review_text || null
    };

    const review = await Review.create(reviewData);

    // Optional: Update user's average rating (more complex, might do later or async)

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error while creating review' });
  }
};

// Get all reviews (optional: add filtering by user, job, etc.)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [ // Include related data for context
        { model: User, as: 'reviewer', attributes: ['uid', 'name'] }, // Don't include sensitive data
        { model: User, as: 'reviewedUser', attributes: ['uid', 'name'] },
        { model: Job, as: 'job', attributes: ['uid', 'status'] }
      ]
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { uid } = req.params;
    const review = await Review.findByPk(uid, {
       include: [
        { model: User, as: 'reviewer', attributes: ['uid', 'name'] },
        { model: User, as: 'reviewedUser', attributes: ['uid', 'name'] },
        { model: Job, as: 'job', attributes: ['uid', 'status'] }
      ]
    });
    if (review) {
      res.status(200).json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get review for a specific job
exports.getReviewByJobId = async (req, res) => {
    try {
        const { job_uid } = req.params;
        const review = await Review.findOne({
            where: { job_uid: job_uid },
            include: [
                { model: User, as: 'reviewer', attributes: ['uid', 'name'] },
                { model: User, as: 'reviewedUser', attributes: ['uid', 'name'] }
            ]
        });
        if (review) {
            res.status(200).json(review);
        } else {
            // It's okay if a job doesn't have a review yet
            res.status(404).json({ error: 'Review not found for this job' });
        }
    } catch (error) {
        console.error('Error fetching review by job ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Update review (less common, implement if needed)
exports.updateReview = async (req, res) => {
    // Implementation depends on requirements (e.g., only allow updating text?)
    res.status(501).json({ message: 'Update review not implemented' });
};

// Delete a review (less common, implement if needed)
exports.deleteReview = async (req, res) => {
    // Implementation depends on requirements (e.g., admin only?)
    res.status(501).json({ message: 'Delete review not implemented' });
};