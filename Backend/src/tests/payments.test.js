const request = require('supertest');
const app = require('../app');
const db = require('../models');

let testBuyer;
let testDooer;
let testJob;
let testPaymentId;

// --- Configuración y Limpieza ---
beforeAll(async () => {
  // Crear usuarios y un job para asociar el pago
  try {
    testBuyer = await db.User.create({ name: 'Test Payment Buyer', email: `testbuyer.payments.${Date.now()}@example.com` });
    testDooer = await db.User.create({ name: 'Test Payment Dooer', email: `testdooer.payments.${Date.now()}@example.com` });
    testJob = await db.Job.create({
      buyer_uid: testBuyer.uid,
      dooer_uid: testDooer.uid,
      status: 'completed' // Asumimos que el pago se hace para un job completado
    });
  } catch (error) {
    console.error("Error creating test data for payments:", error);
  }
});

afterAll(async () => {
  // Limpiar payment, job y usuarios
  try {
    if (testPaymentId) {
      await db.Payment.destroy({ where: { transaction_id: testPaymentId }, force: true });
    }
    if (testJob) {
      await db.Job.destroy({ where: { uid: testJob.uid }, force: true });
    }
    if (testBuyer) {
      await db.User.destroy({ where: { uid: testBuyer.uid }, force: true });
    }
    if (testDooer) {
      await db.User.destroy({ where: { uid: testDooer.uid }, force: true });
    }
  } catch (error) {
    console.error("Error cleaning up test payment data:", error);
  }
  // Cerrar conexión a la BD
  await db.sequelize.close();
});

// --- Pruebas para Endpoints de Payments ---
describe('Payment Endpoints', () => {

  // Prueba para POST /api/payments
  it('should create a new payment', async () => {
    if (!testJob) {
      throw new Error("Test job not created, cannot run 'create payment' test");
    }
    const paymentData = {
      service_id: testJob.uid, // Referencia al job creado
      amount: 150.75,
      // status: 'processed' // Opcional, el controlador tiene default
    };
    const res = await request(app)
      .post('/api/payments')
      .send(paymentData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('transaction_id');
    expect(res.body.service_id).toEqual(testJob.uid);
    expect(res.body.amount).toEqual('150.75'); // DECIMAL se devuelve como string
    expect(res.body.status).toEqual('processed');

    testPaymentId = res.body.transaction_id; // Guarda el ID
  });

  // Prueba para GET /api/payments
  it('should fetch all payments', async () => {
     if (!testPaymentId) {
        throw new Error("Test payment not created, cannot run 'fetch all' test");
    }
    const res = await request(app).get('/api/payments');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    const foundPayment = res.body.find(payment => payment.transaction_id === testPaymentId);
    expect(foundPayment).toBeDefined();
    expect(foundPayment.job).toHaveProperty('uid', testJob.uid); // Verifica include
  });

  // Prueba para GET /api/payments/:transaction_id
  it('should fetch a specific payment by transaction_id', async () => {
    if (!testPaymentId) {
      throw new Error("Test payment not created, cannot run 'fetch by id' test");
    }
    const res = await request(app).get(`/api/payments/${testPaymentId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('transaction_id', testPaymentId);
    expect(res.body.service_id).toEqual(testJob.uid);
  });

  // Prueba para GET /api/jobs/:job_uid/payments
  it('should fetch payments for a specific job', async () => {
     if (!testPaymentId || !testJob) {
      throw new Error("Test data missing for 'fetch by job id' test");
    }
    const res = await request(app).get(`/api/jobs/${testJob.uid}/payments`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    const foundPayment = res.body.find(payment => payment.transaction_id === testPaymentId);
    expect(foundPayment).toBeDefined();
    expect(foundPayment.service_id).toEqual(testJob.uid);
  });

   // Prueba para PUT /api/payments/:transaction_id
   it('should update a payment status', async () => {
    if (!testPaymentId) {
      throw new Error("Test payment not created, cannot run 'update' test");
    }
    const updatedStatus = 'refunded';
    const res = await request(app)
      .put(`/api/payments/${testPaymentId}`)
      .send({
        status: updatedStatus
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', updatedStatus);
  });

  // Prueba para DELETE /api/payments/:transaction_id
  it('should delete a payment', async () => {
    if (!testPaymentId) {
      throw new Error("Test payment not created, cannot run 'delete' test");
    }
    const res = await request(app).delete(`/api/payments/${testPaymentId}`);
    expect(res.statusCode).toEqual(204);
  });

  // Prueba para verificar GET después de DELETE
  it('should return 404 after deleting a payment', async () => {
     if (!testPaymentId) {
       console.warn("Skipping 404 check as testPaymentId is already null or delete test might have failed.");
       return;
    }
    const res = await request(app).get(`/api/payments/${testPaymentId}`);
    expect(res.statusCode).toEqual(404);
    testPaymentId = null; // Anula el ID
  });

  // --- Pruebas de Error ---
  it('should return 400 when creating a payment without amount', async () => {
     if (!testJob) {
      throw new Error("Test job not created, cannot run error test");
    }
    const res = await request(app)
      .post('/api/payments')
      .send({ service_id: testJob.uid });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'service_id (job uid) and amount are required');
  });

   it('should return 404 when creating a payment for non-existent job', async () => {
     const nonExistentJobUid = '11111111-1111-1111-1111-111111111111';
     const res = await request(app)
      .post('/api/payments')
      .send({ service_id: nonExistentJobUid, amount: 10 });
     expect(res.statusCode).toEqual(404);
     expect(res.body).toHaveProperty('error', 'Job (service) not found');
  });

});