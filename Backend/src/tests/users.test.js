const request = require('supertest');
const app = require('../app');
const db = require('../models');

let testUserId;
const uniqueEmail = `testuser.${Date.now()}@example.com`;

// --- Configuración y Limpieza ---
beforeAll(async () => {
  // No se necesitan datos previos específicos para crear un usuario
});

afterAll(async () => {
  // Limpiar el usuario creado después de todas las pruebas de usuarios
  try {
    if (testUserId) {
      await db.User.destroy({ where: { uid: testUserId }, force: true });
    }
  } catch (error) {
    console.error("Error cleaning up test user:", error);
  }
  // Cerrar conexión a la BD
  await db.sequelize.close();
});

// --- Pruebas para Endpoints de Users ---
describe('User Endpoints', () => {

  // Prueba para POST /api/users
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: uniqueEmail,
        description: 'A user for testing',
        is_worker: false,
        is_new: true
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('uid');
    expect(res.body.email).toEqual(uniqueEmail);
    expect(res.body.name).toEqual('Test User');

    testUserId = res.body.uid; // Guarda el ID para usarlo después
  });

  // Prueba para GET /api/users (asumiendo que la creación fue exitosa)
  it('should fetch all users', async () => {
    if (!testUserId) {
        throw new Error("Test user not created, cannot run 'fetch all' test");
    }
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Verifica si el usuario creado está en la lista
    const foundUser = res.body.find(user => user.uid === testUserId);
    expect(foundUser).toBeDefined();
    expect(foundUser.email).toEqual(uniqueEmail);
  });

  // Prueba para GET /api/users/:uid
  it('should fetch a specific user by uid', async () => {
    if (!testUserId) {
      throw new Error("Test user not created, cannot run 'fetch by id' test");
    }
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uid', testUserId);
    expect(res.body.email).toEqual(uniqueEmail);
  });

   // Prueba para PUT /api/users/:uid
   it('should update a user', async () => {
    if (!testUserId) {
      throw new Error("Test user not created, cannot run 'update' test");
    }
    const updatedName = 'Updated Test User';
    const res = await request(app)
      .put(`/api/users/${testUserId}`)
      .send({
        name: updatedName,
        description: 'Updated description'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', updatedName);
    expect(res.body.description).toEqual('Updated description');
  });

  // Prueba para DELETE /api/users/:uid
  it('should delete a user', async () => {
    if (!testUserId) {
      throw new Error("Test user not created, cannot run 'delete' test");
    }
    const res = await request(app).delete(`/api/users/${testUserId}`);
    expect(res.statusCode).toEqual(204);
  });

  // Prueba para verificar GET después de DELETE
  it('should return 404 after deleting a user', async () => {
     if (!testUserId) {
      // Si el ID ya es null por la prueba anterior, el test pasa implícitamente
      // Pero si la prueba de delete falló, necesitamos el ID para verificar
      console.warn("Skipping 404 check as testUserId is already null or delete test might have failed.");
      return;
    }
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toEqual(404);
    testUserId = null; // Anula el ID ya que el usuario fue borrado
  });

  // --- Pruebas de Error ---
  it('should return 400 when creating a user with invalid email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Invalid Email User', email: 'not-an-email' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 when fetching a non-existent user', async () => {
    const nonExistentUid = '11111111-1111-1111-1111-111111111111'; // UUID inválido o no existente
    const res = await request(app).get(`/api/users/${nonExistentUid}`);
    expect(res.statusCode).toEqual(404);
  });

});