const express = require("express");
const db = require("./db");
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())

// Register User
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  db.query(
    "INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "User registered successfully" });
    }
  );
});

// Login User
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM Users WHERE email = ?", [email], (err, result) => {
    if (err || result.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user: result[0] });
  });
});

// Check Room Availability
app.get("/rooms", (req, res) => {
  db.query("SELECT * FROM Rooms WHERE status = 'Available'", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Book a Room
app.post("/book", (req, res) => {
  const { user_id, room_id, check_in, check_out } = req.body;
  db.query(
    "INSERT INTO Bookings (user_id, room_id, check_in, check_out) VALUES (?, ?, ?, ?)",
    [user_id, room_id, check_in, check_out],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Room booked successfully" });
    }
  );
});

// Cancel Booking
app.delete("/cancel/:id", (req, res) => {
  db.query("DELETE FROM Bookings WHERE booking_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Booking cancelled" });
  });
});

// View Booking Details
app.get("/booking/:id", (req, res) => {
  db.query("SELECT * FROM Bookings WHERE booking_id = ?", [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: "Booking not found" });
    res.json(result[0]);
  });
});

// Make Payment
app.post("/payment", (req, res) => {
  const { booking_id, amount, method } = req.body;
  db.query(
    "INSERT INTO Payments (booking_id, amount, method, status) VALUES (?, ?, ?, 'Paid')",
    [booking_id, amount, method],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Payment successful" });
    }
  );
});

// Get Invoice
app.get("/invoice/:booking_id", (req, res) => {
  db.query("SELECT * FROM Invoices WHERE booking_id = ?", [req.params.booking_id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ error: "Invoice not found" });
    res.json(result[0]);
  });
});

// Request Room Service
app.post("/service", (req, res) => {
  const { user_id, room_id, request_details } = req.body;
  db.query(
    "INSERT INTO ServiceRequests (user_id, room_id, request_details, status) VALUES (?, ?, ?, 'Pending')",
    [user_id, room_id, request_details],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Service request submitted" });
    }
  );
});

// Provide Feedback
app.post("/feedback", (req, res) => {
  const { user_id, message, rating } = req.body;
  db.query(
    "INSERT INTO Feedback (user_id, message, rating) VALUES (?, ?, ?)",
    [user_id, message, rating],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Feedback submitted" });
    }
  );
});

// Worker Functions
// Manage Bookings (View all)
app.get("/all-bookings", (req, res) => {
  db.query("SELECT * FROM Bookings", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Assign Room
app.put("/assign-room/:id", (req, res) => {
  db.query("UPDATE Rooms SET status = 'Booked' WHERE room_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Room assigned" });
  });
});

// Process Payment
app.put("/update-payment/:id", (req, res) => {
  db.query("UPDATE Payments SET status = 'Paid' WHERE payment_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Payment updated" });
  });
});

// Generate Invoice
app.post("/generate-invoice", (req, res) => {
  const { booking_id, amount } = req.body;
  db.query(
    "INSERT INTO Invoices (booking_id, amount) VALUES (?, ?)",
    [booking_id, amount],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Invoice generated" });
    }
  );
});

// Assign Room Service Task
app.put("/service/:id", (req, res) => {
  db.query("UPDATE ServiceRequests SET status = 'Completed' WHERE request_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Service task completed" });
  });
});

// Track Inventory
app.get("/inventory", (req, res) => {
  db.query("SELECT * FROM Inventory", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Manage Cleaning Schedule
app.get("/cleaning-schedule", (req, res) => {
  db.query("SELECT * FROM CleaningSchedules", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Manage Employee Records
app.get("/employees", (req, res) => {
  db.query("SELECT * FROM Employees", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Generate Reports
app.get("/reports", (req, res) => {
  db.query("SELECT * FROM Reports", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
