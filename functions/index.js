const { setGlobalOptions } = require("firebase-functions/v2");
setGlobalOptions({ region: "asia-southeast1", maxInstances: 10 });

// Auth
exports.setUserRole = require("./src/auth/setUserRole").setUserRole;
exports.createStaffUser = require("./src/auth/createStaffUser").createStaffUser;
exports.deleteUserAccount = require("./src/auth/deleteUserAccount").deleteUserAccount;

// Orders
exports.createOrder = require("./src/orders/createOrder").createOrder;
exports.updateOrderStatus = require("./src/orders/updateOrderStatus").updateOrderStatus;
exports.cancelOrder = require("./src/orders/cancelOrder").cancelOrder;

// Payments
exports.generateKHQR = require("./src/payments/generateKHQR").generateKHQR;
exports.markOrderPaid = require("./src/payments/markOrderPaid").markOrderPaid;
exports.verifyPaymentWebhook = require("./src/payments/verifyPaymentWebhook").verifyPaymentWebhook;

// Reports
exports.dailySalesSummary = require("./src/reports/dailySalesSummary").dailySalesSummary;