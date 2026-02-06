import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import crypto from 'crypto';

process.env.NODE_ENV = 'test';

let app;
let mongoServer;

import User from '../models/User.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import Payment from '../models/Payment.js';
import razorpay from '../config/razorpay.js';
import jwt from 'jsonwebtoken';

describe('Payment verify + nonce flow', function () {
  this.timeout(20000);

  let server;
  let authToken;
  let createdPlan;

  before(async () => {
    // start in-memory mongo
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // set test secrets
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    process.env.RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';
    process.env.RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_key';

    // require app after env setup
    const mod = await import('../server.js');
    app = mod.app;

    // stub razorpay orders.create
    razorpay.orders = razorpay.orders || {};
    razorpay.orders.create = async (opts) => {
      return { id: `order_${Date.now()}`, amount: opts.amount || 100, currency: opts.currency || 'INR' };
    };

    // create a test user and token
    const user = await User.create({ name: 'Test', email: 'test@example.com', password: 'password123' });
    authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // create a subscription plan
    createdPlan = await SubscriptionPlan.create({ name: '1 Month', durationInDays: 30, price: 100, discountCodes: [] });
  });

  after(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  it('happy path: create-order then verify succeeds', async () => {
    // create order
    const createRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ planId: createdPlan._id.toString() });

    expect(createRes.status).to.equal(200);
    expect(createRes.body).to.have.property('orderId');
    expect(createRes.body).to.have.property('nonce');

    const orderId = createRes.body.orderId;
    const nonce = createRes.body.nonce;

    // simulate payment id returned by gateway
    const paymentId = `pay_${Date.now()}`;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

    const verifyRes = await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: expectedSig, planId: createdPlan._id.toString(), nonce });

    expect(verifyRes.status).to.equal(200);
    expect(verifyRes.body).to.have.property('success', true);

    // ensure payment record status updated
    const pr = await Payment.findOne({ razorpay_order_id: orderId });
    expect(pr).to.exist;
    expect(pr.status).to.equal('success');
  });

  it('replay: using same nonce after success should fail', async () => {
    // create another order
    const createRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ planId: createdPlan._id.toString() });

    const orderId = createRes.body.orderId;
    const nonce = createRes.body.nonce;

    const paymentId = `pay_${Date.now()}`;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

    // first verify succeeds
    const v1 = await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: expectedSig, planId: createdPlan._id.toString(), nonce });

    expect(v1.status).to.equal(200);
    expect(v1.body.success).to.be.true;

    // second verify (replay) should fail (order already verified or nonce cleared)
    const v2 = await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: expectedSig, planId: createdPlan._id.toString(), nonce });

    expect(v2.status).to.be.oneOf([400, 403, 404]);
  });

  it('expired nonce should be rejected', async () => {
    const createRes = await request(app)
      .post('/api/payment/create-order')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ planId: createdPlan._id.toString() });

    expect(createRes.status).to.equal(200);
    const orderId = createRes.body.orderId;
    const nonce = createRes.body.nonce;

    // expire the nonce manually in DB
    await Payment.findOneAndUpdate({ razorpay_order_id: orderId }, { nonceExpires: new Date(Date.now() - 60 * 1000) });

    const paymentId = `pay_${Date.now()}`;
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

    const res = await request(app)
      .post('/api/payment/verify')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: expectedSig, planId: createdPlan._id.toString(), nonce });

    expect(res.status).to.equal(400);
    expect(res.body.message || res.body.error).to.exist;
  });
});
