const express = require("express");
const router = express.Router();
const OrderProcessorController = require("../controllers/order.controller");

// Get the status of the order processor
router.get("/status", (req, res) => {
  const status = OrderProcessorController.getStatus();
  res.json({ status });
});

// Stop the order processor
router.post("/stop", (req, res) => {
  OrderProcessorController.stop();
  res.json({ success: true });
});

module.exports = router;
