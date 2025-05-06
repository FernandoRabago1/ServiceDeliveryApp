// src/models/user.model.js
// *estas son tus viejas funciones, ahora usando Sequelize bajo el capó*
const User = require('./User.js');

async function findOneByEmail(email) {
  const user = await User.findOne({ where: { email } });
  return user || null;
}

async function findOneById(uid) {
  const user = await User.findByPk(uid);
  return user || null;
}

async function insertUser({ name, email, password, role, twofaEnable, twofaSecret }) {
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    twofaEnable,
    twofaSecret,
    // identityVerificationStatus se rellena por defecto en el modelo
  });
  return newUser;
}

async function updateUser(uid, fields) {
  const user = await User.findByPk(uid);
  if (!user) return null;
  const updated = await user.update(fields);
  return updated;
}

module.exports = {
  findOneByEmail,
  findOneById,
  insertUser,
  updateUser
};
