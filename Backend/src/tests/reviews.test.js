const request = require('supertest');
const app = require('../app');
const db = require('../models');

let testBuyer;
let testDooer;
let testJobPending;
let testJobCompleted;
let testReviewId;

// --- Configuración y Limpieza ---
beforeAll(async () => {
  // Crear usuarios y jobs necesarios
  try {
    testBuyer = await db.User.create({ name: 'Test Review Buyer', email: `testbuyer.reviews.${Date.now()}@example.com` });
    testDooer = await db.User.create({ name: 'Test Review Dooer', email: `testdooer.reviews.${Date.now()}@example.com` });

    // Crear un job pendiente
    testJobPending = await db.Job.create({
      buyer_uid: testBuyer.uid,
      dooer_uid: testDooer.uid,
      status: 'pending'
    });

    // Crear un job y marcarlo como completado
    testJobCompleted = await db.Job.create({
      buyer_uid: testBuyer.uid,
      dooer_uid: testDooer.uid,
      status: 'pending' // Crear como pendiente primero
    });
    // Actualizar a completado (simulando el flujo)
    await testJobCompleted.update({ status: 'completed' });

  } catch (error) {
    console.error("Error creating test data for reviews:", error);
  }
});

afterAll(async () => {
  // Limpiar review, jobs y usuarios
  try {
    if (testReviewId) {
      await db.Review.destroy({ where: { uid: testReviewId }, force: true });
    }
    if (testJobPending) {
      await db.Job.destroy({ where: { uid: testJobPending.uid }, force: true });
    }
    if (testJobCompleted) {
      await db.Job.destroy({ where: { uid: testJobCompleted.uid }, force: true });
    }
    if (testBuyer) {
      await db.User.destroy({ where: { uid: testBuyer.uid }, force: true });
    }
    if (testDooer) {
      await db.User.destroy({ where: { uid: testDooer.uid }, force: true });
    }
  } catch (error) {
    console.error("Error cleaning up test review data:", error);
  }
  // Cerrar conexión a la BD
  await db.sequelize.close();
});

// --- Pruebas para Endpoints de Reviews ---
describe('Review Endpoints', () => {

  // --- Pruebas de Error (Creación) ---
  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ job_uid: testJobCompleted?.uid, reviewer_uid: testBuyer?.uid }); // Falta rating
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'job_uid, reviewer_uid, and rating are required');
  });

  it('should return 404 if job does not exist', async () => {
     const nonExistentJobUid = '11111111-1111-1111-1111-111111111111';
     const res = await request(app)
      .post('/api/reviews')
      .send({ job_uid: nonExistentJobUid, reviewer_uid: testBuyer?.uid, rating: 5 });
     expect(res.statusCode).toEqual(404);
     expect(res.body).toHaveProperty('error', 'Job not found');
  });

  it('should return 400 if job is not completed', async () => {
    if (!testJobPending || !testBuyer) {
        throw new Error("Test data missing for 'job not completed' test");
    }
    const res = await request(app)
      .post('/api/reviews')
      .send({ job_uid: testJobPending.uid, reviewer_uid: testBuyer.uid, rating: 4 });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Job must be completed to be reviewed');
  });

   it('should return 403 if reviewer is not the buyer', async () => {
    if (!testJobCompleted || !testDooer) {
        throw new Error("Test data missing for 'reviewer not buyer' test");
    }
    const res = await request(app)
      .post('/api/reviews')
      .send({ job_uid: testJobCompleted.uid, reviewer_uid: testDooer.uid, rating: 5 }); // Dooer intenta reseñar
    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('error', 'Only the job buyer can review this job');
  });

  // --- Prueba de Éxito (Creación) ---
  it('should create a new review for a completed job', async () => {
    if (!testJobCompleted || !testBuyer || !testDooer) {
      throw new Error("Test data missing for 'create review' test");
    }
    const reviewData = {
      job_uid: testJobCompleted.uid,
      reviewer_uid: testBuyer.uid, // El buyer reseña
      rating: 5,
      review_text: 'Excellent work!'
    };
    const res = await request(app)
      .post('/api/reviews')
      .send(reviewData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('uid');
    expect(res.body.job_uid).toEqual(testJobCompleted.uid);
    expect(res.body.reviewer_uid).toEqual(testBuyer.uid);
    expect(res.body.reviewed_uid).toEqual(testDooer.uid); // Verifica que se reseñó al dooer
    expect(res.body.rating).toEqual(5);

    testReviewId = res.body.uid; // Guarda el ID
  });

   // --- Prueba de Error (Creación Duplicada) ---
   it('should return 400 if job has already been reviewed', async () => {
    if (!testJobCompleted || !testBuyer) {
      throw new Error("Test data missing for 'already reviewed' test");
    }
     const reviewData = { // Intenta crear otra reseña para el mismo job
      job_uid: testJobCompleted.uid,
      reviewer_uid: testBuyer.uid,
      rating: 4
    };
    const res = await request(app)
      .post('/api/reviews')
      .send(reviewData);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Job has already been reviewed');
  });

  // --- Pruebas GET ---
  it('should fetch all reviews', async () => {
     if (!testReviewId) {
        throw new Error("Test review not created, cannot run 'fetch all' test");
    }
    const res = await request(app).get('/api/reviews');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    const foundReview = res.body.find(review => review.uid === testReviewId);
    expect(foundReview).toBeDefined();
    expect(foundReview.reviewer).toHaveProperty('uid', testBuyer.uid);
    expect(foundReview.reviewedUser).toHaveProperty('uid', testDooer.uid);
  });

  it('should fetch a specific review by uid', async () => {
    if (!testReviewId) {
      throw new Error("Test review not created, cannot run 'fetch by id' test");
    }
    const res = await request(app).get(`/api/reviews/${testReviewId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uid', testReviewId);
    expect(res.body.job_uid).toEqual(testJobCompleted.uid);
  });

  it('should fetch the review for a specific job', async () => {
     if (!testReviewId || !testJobCompleted) {
      throw new Error("Test data missing for 'fetch by job id' test");
    }
    const res = await request(app).get(`/api/jobs/${testJobCompleted.uid}/review`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('uid', testReviewId);
  });

  it('should return 404 when fetching review for a job with no review', async () => {
     if (!testJobPending) {
      throw new Error("Test data missing for 'fetch non-existent review' test");
    }
    const res = await request(app).get(`/api/jobs/${testJobPending.uid}/review`);
    expect(res.statusCode).toEqual(404);
  });

  // Nota: Las pruebas para PUT y DELETE se omiten ya que los controladores devuelven 501 Not Implemented.
  // Si implementas esas rutas, añade las pruebas correspondientes aquí.

});