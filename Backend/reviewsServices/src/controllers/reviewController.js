const service = require('../services/reviewService');

exports.createReview = async (req, res) => {
  try {
    const result = await service.addReview(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByService = async (req, res) => {
  try {
    const result = await service.getReviewsByServiceId(req.params.serviceId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByUser = async (req, res) => {
  try {
    const result = await service.getReviewsByUserId(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
