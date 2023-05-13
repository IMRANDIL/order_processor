const Order = require("../models/order.model");
const RedisMQ = require("rsmq");
var RSMQWorker = require("rsmq-worker");
var worker = new RSMQWorker("orderQueue");
// const nodemailer = require("nodemailer");
// const logger = require("../utils/logger");

// const rsmq = new RedisMQ({
//   host: process.env.REDIS_HOST, // Redis host address (Docker container IP)
//   port: process.env.REDIS_PORT, // Redis port (default: 6379)
//   ns: process.env.REDIS_NAMESPACE, // Optional: Redis namespace
// });

// Register the message handler
// rsmq.receiveMessage({ qname: "orderQueue" }, function (err, resp) {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   if (resp.id) {
//     console.log("Message received.", resp);
//   } else {
//     console.log("No messages for me...");
//   }
// });

// Process an order
// const processOrder = async (message) => {
//   try {
//     const orderData = JSON.parse(message);

//     // Perform the necessary processing logic here
//     // For example, send an email to the customer
//     const { customerName, productName, quantity } = orderData;
//     const emailContent = `Thank you, ${customerName}, for your order of ${quantity} ${productName}(s).`;

//     // Send email to the customer
//     await sendEmail(customerName, emailContent);
//   } catch (error) {
//     throw new Error(`Failed to process order: ${error}`);
//   }
// };

// Send email to the customer
// const sendEmail = async (recipient, content) => {
//   try {
//     // Create a Nodemailer transporter
//     const transporter = nodemailer.createTransport({
//       // Configure your email provider settings here
//       // For example, if using Gmail SMTP:
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     // Define the email options
//     const mailOptions = {
//       from: process.env.EMAIL_SENDER,
//       to: recipient,
//       subject: "Order Confirmation",
//       text: content,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);
//     logger.info(`Email sent to ${recipient}`);
//   } catch (error) {
//     throw new Error(`Failed to send email: ${error}`);
//   }
// };

worker.on("message", function (msg, next, id) {
  // process your message
  console.log("Message id : " + id);
  console.log(msg);
  next();
});

// optional error listeners
worker.on("error", function (err, msg) {
  console.log("ERROR", err, msg.id);
});
worker.on("exceeded", function (msg) {
  console.log("EXCEEDED", msg.id);
});
worker.on("timeout", function (msg) {
  console.log("TIMEOUT", msg.id, msg.rc);
});

worker.start();
