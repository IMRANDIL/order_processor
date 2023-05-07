const Order = require("../models/order.model");
const RSMQWorker = require("rsmq-worker");
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

// Create an RSMQ worker for processing orders
const worker = new RSMQWorker("orderQueue");

// Register the message handler
worker.on("message", async (message, next, id) => {
  try {
    // Process the order
    await processOrder(message);

    // Mark the message as processed
    worker.del(id);

    // Call the next message processing
    next();
  } catch (error) {
    logger.error(`Failed to process order: ${error}`);

    // Retry the message
    next(error);
  }
});

// Start the worker
worker.start();

// Process an order
const processOrder = async (message) => {
  try {
    const orderData = JSON.parse(message);

    // Perform the necessary processing logic here
    // For example, send an email to the customer
    const { customerName, productName, quantity } = orderData;
    const emailContent = `Thank you, ${customerName}, for your order of ${quantity} ${productName}(s).`;

    // Send email to the customer
    await sendEmail(customerName, emailContent);
  } catch (error) {
    throw new Error(`Failed to process order: ${error}`);
  }
};

// Send email to the customer
const sendEmail = async (recipient, content) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      // Configure your email provider settings here
      // For example, if using Gmail SMTP:
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: recipient,
      subject: "Order Confirmation",
      text: content,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${recipient}`);
  } catch (error) {
    throw new Error(`Failed to send email: ${error}`);
  }
};
