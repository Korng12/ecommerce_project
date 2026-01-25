// backend/routes/payments.js
const express = require("express");
const verifyJWT = require("../../middleware/authJwt.js");
const {
  createPaymentIntent,
  stripeWebhook,
  confirmPaymentSuccess,
} = require("../../controllers/paymentController.js");

// Webhook router - MUST use raw body and come before JSON parser
const webhookRouter = express.Router();
webhookRouter.post(
  "/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// API routes - can use JSON parser
const apiRouter = express.Router();

apiRouter.post("/payments/create-intent", verifyJWT, createPaymentIntent);

apiRouter.post("/payments/confirm-success", verifyJWT, confirmPaymentSuccess);

module.exports = {
  webhookOnly: webhookRouter,
  apiRoutes: apiRouter,
};
