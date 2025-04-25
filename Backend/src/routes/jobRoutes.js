const express = require('express');
const jobController = require('../controllers/jobController');

const router = express.Router();

// Route to create a new job
router.post('/jobs', jobController.createJob);

// Route to get all jobs
router.get('/jobs', jobController.getAllJobs);

// Route to get a job by ID
router.get('/jobs/:uid', jobController.getJobById);

// Route to update job information
router.put('/jobs/:uid', jobController.updateJob);

// Route to delete a job
router.delete('/jobs/:uid', jobController.deleteJob);

module.exports = router;