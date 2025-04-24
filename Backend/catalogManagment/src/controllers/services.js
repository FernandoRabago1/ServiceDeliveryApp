const db = require('../models/services');
const searchService = require('../services/search');

exports.getAllServices = async (req, res) => {
  const services = await db.getAll();
  res.json(services);
};

exports.createService = async (req, res) => {
  const { provider_id, description, category, pricing_model } = req.body;
  const newService = await db.create({ provider_id, description, category, pricing_model });
  await searchService.indexService(newService); // Elasticsearch
  res.status(201).json(newService);
};

exports.updateService = async (req, res) => {
  const updated = await db.update(req.params.id, req.body);
  res.json(updated);
};

exports.deleteService = async (req, res) => {
  await db.remove(req.params.id);
  res.sendStatus(204);
};

exports.getByCategory = async (req, res) => {
  const services = await db.findByCategory(req.params.category);
  res.json(services);
};

exports.searchServices = async (req, res) => {
  const results = await searchService.search(req.params.term);
  res.json(results);
};
