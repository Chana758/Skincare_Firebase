const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");

setGlobalOptions({
  maxInstances: 10,
});


// AUTH
exports.setUserRole = require("./src/auth/setUserRole");


// ORDERS
exports.createOrder = require("./src/orders/createOrder");
exports.updateOrderStatus = require("./src/orders/updateOrderStatus");
exports.cancelOrder = require("./src/orders/cancelOrder");


// PAYMENT
exports.generateKHQR = require("./src/payments/generateKHQR");
exports.verifyPaymentWebhook = require("./src/payments/verifyPaymentWebhook");


// REPORT
exports.dailySalesSummary = require("./src/reports/dailySalesSummary");