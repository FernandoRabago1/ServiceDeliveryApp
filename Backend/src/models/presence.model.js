// src/models/presence.model.js
const online = new Set();

/** Marca usuario online/offline */
const setOnline = (id, on) => on ? online.add(id) : online.delete(id);
/** ¿Está online? */
const isOnline = id => online.has(id);
/** Lista de todos los IDs online */
const getAllOnline = () => [...online];

module.exports = {
  setOnline,
  isOnline,
  getAllOnline
};
