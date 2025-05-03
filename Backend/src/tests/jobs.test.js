const request = require('supertest');
const app = require('../app'); 
const db = require('../models'); 

// Variables para guardar IDs creados durante las pruebas
let testUserBuyer;
let testUserDooer;
let testJobId;

// --- Configuración y Limpieza ---
beforeAll(async () => {
  try {
    testUserBuyer = await db.User.create({ name: 'Test Buyer Jobs', email: `testbuyer.jobs.${Date.now()}@example.com` });
    testUserDooer = await db.User.create({ name: 'Test Dooer Jobs', email: `testdooer.jobs.${Date.now()}@example.com` });
  } catch (error) {
    console.error("Error creating test users:", error);
  }
});

afterAll(async () => {
  // Limpiar TODO lo creado DESPUÉS de todas las pruebas de jobs
  try {
    if (testJobId) {
      await db.Job.destroy({ where: { uid: testJobId }, force: true });
    }
    if (testUserBuyer) {
      await db.User.destroy({ where: { uid: testUserBuyer.uid }, force: true });
    }
    if (testUserDooer) {
      await db.User.destroy({ where: { uid: testUserDooer.uid }, force: true });
    }
  } catch (error) {
    console.error("Error cleaning up test data:", error);
  }
  // Cerrar conexión a la BD para que Jest pueda salir limpiamente
  await db.sequelize.close();
});

// --- Pruebas para Endpoints de Jobs ---
describe('Job Endpoints', () => {

  // Prueba para POST /api/jobs
  it('should create a new job', async () => {
    if (!testUserBuyer || !testUserDooer) {
        throw new Error("Test users not created, cannot run test"); // Fail fast if setup failed
    }
    const res = await request(app)
      .post('/api/jobs')
      .send({
        buyer_uid: testUserBuyer.uid, // Usa el ID del usuario creado
        dooer_uid: testUserDooer.uid, // Opcional, usa el otro usuario
        scheduled_time: new Date(Date.now() + 86400000).toISOString() // Mañana
      });

    expect(res.statusCode).toEqual(201); // Espera código 201 Created
    expect(res.body).toHaveProperty('uid'); // Espera que la respuesta tenga un uid
    expect(res.body.buyer_uid).toEqual(testUserBuyer.uid);
    expect(res.body.status).toEqual('pending');

    testJobId = res.body.uid; // Guarda el ID para usarlo en otras pruebas y limpiarlo
  });

  // Prueba para GET /api/jobs
  it('should fetch all jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true); // Espera que la respuesta sea un array
    // Podrías añadir más aserciones, como verificar que el job creado esté en la lista
  });

  // Prueba para GET /api/jobs/:uid
  it('should fetch a specific job by uid', async () => {
    if (!testJobId) {
      throw new Error("testJobId not set, cannot run test");
    }
    const res = await request(app).get(`/api/jobs/${testJobId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uid', testJobId);
    expect(res.body.buyer).toHaveProperty('uid', testUserBuyer.uid); // Verifica el include
  });

   // Prueba para PUT /api/jobs/:uid
   it('should update a job status', async () => {
    if (!testJobId) {
      throw new Error("testJobId not set, cannot run test");
    }
    const res = await request(app)
      .put(`/api/jobs/${testJobId}`)
      .send({
        status: 'accepted'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'accepted');
  });

  // Prueba para DELETE /api/jobs/:uid (¡CUIDADO!)
  // Esta prueba eliminará el job creado. Si otras pruebas dependen de él, ejecútala al final.
  it('should delete a job', async () => {
    if (!testJobId) {
      throw new Error("testJobId not set, cannot run test");
    }
    const res = await request(app).delete(`/api/jobs/${testJobId}`);
    expect(res.statusCode).toEqual(204); // Espera código 204 No Content

    // Verifica que realmente se borró (opcional pero bueno)
    const checkRes = await request(app).get(`/api/jobs/${testJobId}`);
    expect(checkRes.statusCode).toEqual(404); // Espera Not Found

    testJobId = null; // Anula el ID ya que el job fue borrado
  });

});