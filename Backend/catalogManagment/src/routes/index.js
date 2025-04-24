const express = require('express');
const router = express.Router();
const {
  getAllServices,
  createService,
  updateService,
  deleteService,
  getByCategory,
  searchServices,
} = require('../controllers/services');

router.get('/', getAllServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);
router.get('/category/:category', getByCategory);
router.get('/search/:term', searchServices);

module.exports = router;
