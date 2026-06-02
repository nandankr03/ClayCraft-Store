require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const https = require("https");
const fs = require("fs");
const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory OTP store
const otps = {};

// Serve frontend files
app.use(express.static(path.join(__dirname, "../Frontend")));
app.use('/images', express.static(path.join(__dirname, '../Frontend/Images')));

// database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nandan@95728",
  database: "clay_pottery"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Database connected successfully");
    const createOrdersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        products TEXT,
        total_price DECIMAL(10, 2),
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    db.query(createOrdersTable, (err, result) => {
      if (err) console.log("Error creating orders table:", err);
    });
  }
});

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to take our messages');
  }
});

// test route
app.get("/api/status", (req, res) => {
  res.send("Backend is running successfully");
});

// Send OTP Route
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: req.body.email,
    subject: "Your OTP for ClayCraft",
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP", error);
    res.json({ message: "Failed to send OTP" });
  }
});

// Signup Route
app.post("/signup", async (req, res) => {
  const { fullName, email, password, role, otp } = req.body;

  if (!fullName || !email || !password || !otp) {
    return res.json({ message: "All fields including OTP are required" });
  }

  if (!otps[email] || otps[email].otp !== otp) {
    return res.json({ message: "Invalid OTP" });
  }
  if (Date.now() > otps[email].expiresAt) {
    delete otps[email];
    return res.json({ message: "OTP expired, request new OTP" });
  }

  const userRole = role || 'customer';

  try {
    if (userRole === 'admin') {
      const existingAdmins = await new Promise((resolve, reject) => {
        db.query("SELECT id FROM users WHERE role = 'admin'", (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
      if (existingAdmins.length > 0) {
        return res.json({ message: "Admin already exists. Only one admin is allowed." });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = "INSERT INTO users (fullName, email, password, role) VALUES (?, ?, ?, ?)";

    db.query(sql, [fullName, email, hashedPassword, userRole], (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ message: "Email already exists or database error" });
      }

      delete otps[email];
      res.json({ message: "Signup successful 🎉" });
    });
  } catch (error) {
    console.log(error);
    res.json({ message: "Server error" });
  }
});

// Forgot Password Send OTP
app.post("/api/forgot-password-otp", (req, res) => {
  const { email } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err || result.length === 0) return res.json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Password Reset OTP - ClayCraft",
      text: `Your OTP for password reset is: ${otp}`
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.json({ message: "Failed to send OTP" });
    }
  });
});

// Reset Password API
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.json({ message: "All fields are required" });

  if (!otps[email] || otps[email].otp !== otp) {
    return res.json({ message: "Invalid OTP" });
  }
  if (Date.now() > otps[email].expiresAt) {
    delete otps[email];
    return res.json({ message: "OTP expired, request new OTP" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  db.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, result) => {
    if (err) return res.json({ message: "Database error" });
    delete otps[email];
    res.json({ message: "Password reset successful" });
  });
});

// Check if admin exists
app.get("/api/admin-exists", (req, res) => {
  db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1", (err, results) => {
    if (err) {
      console.log(err);
      return res.json({ exists: false });
    }
    res.json({ exists: results.length > 0 });
  });
});


// Login API
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ message: "Database error" });
    }

    if (result.length > 0) {
      const user = result[0];

      if (role && user.role !== role) {
        return res.json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "default_secret",
          { expiresIn: "1h" }
        );
        res.json({ message: "Login successful", token, role: user.role });
      } else {
        res.json({ message: "invalid email or password" });
      }
    } else {
      res.json({ message: "invalid email or password" });
    }
  });
});

// Get all users (Admin)
app.get("/api/users", (req, res) => {
  db.query("SELECT id, fullName as name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// Delete user (Admin)
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("SELECT role FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    
    if (results[0].role === 'admin') {
      return res.status(403).json({ message: "Cannot delete admin account" });
    }

    db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error" });
      res.json({ message: "User deleted successfully" });
    });
  });
});

// Checkout API Endpoint
app.post('/api/checkout', async (req, res) => {
  try {
    const { email, phone, notifyEmail, notifySms, customerName, items, total } = req.body;

    let messages = [];
    const orderId = 'CC' + Math.floor(10000 + Math.random() * 90000);
    const userName = customerName || 'Customer';
    const displayTotal = total ? total : 499;
    const productsJson = JSON.stringify(items || [{ name: 'Handcrafted Item', quantity: 1, price: 499 }]);

    // Save order to DB
    const insertSql = "INSERT INTO orders (order_id, customer_name, products, total_price) VALUES (?, ?, ?, ?)";
    db.query(insertSql, [orderId, userName, productsJson, displayTotal], (err, result) => {
      if (err) console.error("Error saving order to DB:", err);
    });

    // Send Email if requested
    if (notifyEmail && email) {
      const today = new Date();
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      const orderDate = today.toLocaleDateString('en-GB', options);
      
      const delDate = new Date();
      delDate.setDate(delDate.getDate() + 5);
      const deliveryDate = delDate.toLocaleDateString('en-GB', options);
      
      const baseUrl = req.protocol + "://" + req.get("host");
      
      let itemsHtml = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #eee; color: #333; font-size: 15px;">Product Name</th>
              <th style="text-align: center; padding: 10px; border-bottom: 2px solid #eee; color: #333; font-size: 15px;">Qty</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #eee; color: #333; font-size: 15px;">Price</th>
            </tr>
          </thead>
          <tbody>
      `;

      if (items && items.length > 0) {
        items.forEach(item => {
          itemsHtml += `
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eee; color: #555; font-size: 14px;">${item.name}</td>
              <td style="text-align: center; padding: 12px 10px; border-bottom: 1px solid #eee; color: #555; font-size: 14px;">${item.quantity}</td>
              <td style="text-align: right; padding: 12px 10px; border-bottom: 1px solid #eee; color: #e63946; font-size: 14px; font-weight: bold;">₹ ${item.price}</td>
            </tr>
          `;
        });
      } else {
        itemsHtml += `
            <tr>
              <td style="padding: 12px 10px; border-bottom: 1px solid #eee; color: #555; font-size: 14px;">Handcrafted Item (Example)</td>
              <td style="text-align: center; padding: 12px 10px; border-bottom: 1px solid #eee; color: #555; font-size: 14px;">1</td>
              <td style="text-align: right; padding: 12px 10px; border-bottom: 1px solid #eee; color: #e63946; font-size: 14px; font-weight: bold;">₹ 499</td>
            </tr>
        `;
      }
      
      itemsHtml += `
          </tbody>
        </table>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Payment Successful! Your Order Receipt - Clay Pottery & Sandstone',
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #eaeaea;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #28a745; margin: 0; font-size: 26px;">🎉 Order Confirmed!</h2>
              </div>
              <div style="margin-bottom: 25px; padding: 15px; background-color: #fffafb; border-radius: 8px; border: 1px solid #fde7e9;">
                <p style="font-size: 16px; margin: 0 0 10px 0; color: #333;">Hi <strong>${userName}</strong>,</p>
                <p style="font-size: 15px; margin: 0 0 5px 0; color: #555;"><strong>Order ID:</strong> ${orderId}</p>
                <p style="font-size: 15px; margin: 0 0 5px 0; color: #555;"><strong>Order Date:</strong> ${orderDate}</p>
                <p style="font-size: 15px; margin: 0; color: #555;"><strong>Estimated Delivery:</strong> ${deliveryDate} 🚚</p>
              </div>
              <div style="margin-bottom: 20px;">
                <h3 style="margin-top: 0; margin-bottom: 10px; font-size: 18px; color: #333;">Order Details</h3>
                ${itemsHtml}
              </div>
              <div style="text-align: right; margin-bottom: 30px; padding-top: 15px; border-top: 2px solid #eee;">
                <p style="font-size: 20px; font-weight: bold; color: #333; margin: 0;">Total Paid: <span style="color: #e63946;">₹ ${displayTotal}</span></p>
              </div>
              <div style="text-align: center; margin-bottom: 30px;">
                <p style="color: #555; font-size: 16px; margin-bottom: 20px;">Thank you for your order!</p>
                <a href="${baseUrl}/track-order?orderId=${orderId}" style="display: inline-block; background-color: #e63946; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">Track Your Order</a>
              </div>
              <div style="text-align: center; color: #999; font-size: 13px; border-top: 1px solid #eee; padding-top: 20px;">
                <p style="margin: 0;">We will notify you once your order has shipped.</p>
                <p style="margin: 5px 0 0 0;">© ${today.getFullYear()} Clay Pottery & Sandstone. All rights reserved.</p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      messages.push('Email sent successfully');
    }

    // Output success SMS message
    if (phone) {
      const phoneNumber = String(phone);
      console.log("Checking phone and API key for SMS:", { phone: phoneNumber, apiKey: process.env.FAST2SMS_API_KEY ? 'exists' : 'missing' });
      
      const productNames = (items && items.length > 0) ? items.map(i => i.name).join(', ') : 'Handcrafted Item';
      const messageText = `Payment Successful! Your order for ${productNames} (Amt: Rs.${displayTotal}) has been placed.`;

      const options = {
        hostname: 'www.fast2sms.com',
        path: '/dev/bulkV2',
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY || '',
          'Content-Type': 'application/json'
        }
      };

      const reqSms = https.request(options, (resSms) => {
        let data = '';
        resSms.on('data', (chunk) => { data += chunk; });
        resSms.on('end', () => {
          console.log("Fast2SMS Response:", data);
        });
      });

      reqSms.on('error', (error) => {
        console.error("Error sending SMS via Fast2SMS:", error);
      });

      reqSms.write(JSON.stringify({
        route: 'q',
        message: messageText,
        language: 'english',
        flash: 0,
        numbers: phoneNumber
      }));

      reqSms.end();

      console.log(`[SMS SENT] To ${phoneNumber}: ${messageText}`);
      messages.push('SMS sent successfully');
    }

    res.status(200).json({ success: true, message: messages.join(', ') });
  } catch (error) {
    console.error('Error during checkout process:', error);
    res.status(500).json({ success: false, error: 'Failed to send notifications. Try updating your App Password in .env.' });
  }
});

// Get all orders
app.get("/api/orders", (req, res) => {
  db.query("SELECT * FROM orders ORDER BY date DESC", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});

// ── Contact Form Endpoint ────────────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Simulate sending the message to the admin's phone/email
  console.log('\n--- NEW CONTACT MESSAGE RECEIVED ---');
  console.log(`From: ${name} (${email})`);
  console.log(`Message: ${message}`);
  console.log(`=> Notification forwarded to Admin at +91 9334735906 and support@claypottery.com`);
  console.log('------------------------------------\n');

  res.status(200).json({ success: true, message: 'Message forwarded to Admin.' });
});

// ── Track Order Route ───────────────────────────────────────────────────
app.get('/track-order', (req, res) => {
  const orderId = req.query.orderId || 'Unknown';
  const filePath = path.join(__dirname, '../Frontend/track.html');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading track.html:", err);
      return res.status(500).send("Tracking page not available.");
    }
    // Replace placeholder with actual order ID
    const html = data.replace(/{{ORDER_ID}}/g, orderId);
    res.send(html);
  });
});

  // SERVER START
  app.listen(5000, () => {
    console.log("Server running on port 5000");
    console.log("Visit http://localhost:5000 in your browser to see the website.");
  });