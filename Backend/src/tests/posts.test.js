const request = require('supertest');
const app = require('../app');
const db = require('../models');

let testOwner;
let testPostId;

// --- Configuración y Limpieza ---
beforeAll(async () => {
  try {
    testOwner = await db.User.create({ name: 'Test Post Owner', email: `testowner.posts.${Date.now()}@example.com` });
    // Añadir verificación opcional si sospechas de la creación del usuario
    if (!testOwner || !testOwner.uid) {
        throw new Error('Test owner creation failed silently.');
    }
  } catch (error) {
    console.error("Error creating test owner user:", error);
    throw error; // <-- RE-LANZA EL ERROR para detener Jest si falla
  }
});

afterAll(async () => {
  // Limpiar el post y el usuario creados
  try {
    if (testPostId) {
      await db.Post.destroy({ where: { uid: testPostId }, force: true });
    }
    if (testOwner) {
      await db.User.destroy({ where: { uid: testOwner.uid }, force: true });
    }
  } catch (error) {
    console.error("Error cleaning up test post data:", error);
  }
  // Cerrar conexión a la BD
  await db.sequelize.close();
});

// --- Pruebas para Endpoints de Posts ---
describe('Post Endpoints', () => {

  // Prueba para POST /api/posts
  it('should create a new post', async () => {
    if (!testOwner) {
      throw new Error("Test owner not created, cannot run 'create post' test");
    }
    const postData = {
      owner_uid: testOwner.uid, // Referencia al dueño creado
      title: 'My Test Post',
      body: 'This is the content of the test post.',
      latitude: 40.7128,
      longitude: -74.0060,
      cost: 25.50
    };
    const res = await request(app)
      .post('/api/posts')
      .send(postData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('uid');
    expect(res.body.owner_uid).toEqual(testOwner.uid);
    expect(res.body.title).toEqual(postData.title);

    testPostId = res.body.uid; // Guarda el ID
  });

  // Prueba para GET /api/posts
  it('should fetch all posts', async () => {
     if (!testPostId) {
        throw new Error("Test post not created, cannot run 'fetch all' test");
    }
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    const foundPost = res.body.find(post => post.uid === testPostId);
    expect(foundPost).toBeDefined();
    expect(foundPost.owner.uid).toEqual(testOwner.uid); // Verifica el include 'owner'
  });

  // Prueba para GET /api/posts/:uid
  it('should fetch a specific post by uid', async () => {
    if (!testPostId) {
      throw new Error("Test post not created, cannot run 'fetch by id' test");
    }
    const res = await request(app).get(`/api/posts/${testPostId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uid', testPostId);
    expect(res.body.owner).toHaveProperty('uid', testOwner.uid); // Verifica el include 'owner'
  });

   // Prueba para PUT /api/posts/:uid
   it('should update a post', async () => {
    if (!testPostId) {
      throw new Error("Test post not created, cannot run 'update' test");
    }
    const updatedTitle = 'Updated Test Post Title';
    const res = await request(app)
      .put(`/api/posts/${testPostId}`)
      .send({
        title: updatedTitle,
        cost: 30.00
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('title', updatedTitle);
    expect(res.body.cost).toEqual(30.00); // Sequelize devuelve números para FLOAT/DECIMAL
  });

  // Prueba para DELETE /api/posts/:uid
  it('should delete a post', async () => {
    if (!testPostId) {
      throw new Error("Test post not created, cannot run 'delete' test");
    }
    const res = await request(app).delete(`/api/posts/${testPostId}`);
    expect(res.statusCode).toEqual(204);
  });

  // Prueba para verificar GET después de DELETE
  it('should return 404 after deleting a post', async () => {
    if (!testPostId) {
       console.warn("Skipping 404 check as testPostId is already null or delete test might have failed.");
       return;
    }
    const res = await request(app).get(`/api/posts/${testPostId}`);
    expect(res.statusCode).toEqual(404);
    testPostId = null; // Anula el ID
  });

  // --- Pruebas de Error ---
  it('should return 400 when creating a post without owner_uid', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ title: 'Post without owner' });
    expect(res.statusCode).toEqual(400); // O 500 dependiendo de cómo maneje el controlador la falta de owner_uid
    expect(res.body).toHaveProperty('error');
  });

  it('should return 404 when updating a non-existent post', async () => {
    const nonExistentUid = '11111111-1111-1111-1111-111111111111';
    const res = await request(app)
      .put(`/api/posts/${nonExistentUid}`)
      .send({ title: 'Trying to update non-existent' });
    expect(res.statusCode).toEqual(404);
  });

});