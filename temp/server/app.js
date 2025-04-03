const express = require('express');
const db = require('./db');
const app = express();
const port = 3000;

app.use(express.json());

const isRoomAvailable = (roomId, callback) => {
    db.query("SELECT status FROM rooms WHERE id = ?", [roomId], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, false);
        callback(null, results[0].status === 'available');
    });
};

// Check room availability endpoint (lists only available rooms)
app.get('/check-room/:id', (req, res) => {
    db.query("SELECT * FROM rooms WHERE booked = 0 and id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});


// Register a user
app.post('/register', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User registered successfully', userId: result.insertId });
    });
});

// Get all available rooms
app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM rooms WHERE booked = FALSE', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Book a room
app.post('/book', (req, res) => {
    const { userId, roomId } = req.body;
    db.query("SELECT status FROM rooms WHERE id = ?", [roomId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'Room not found' });
        if (results[0].status !== 'available') return res.status(400).json({ error: 'Room is already booked' });

        db.query('INSERT INTO bookings (user_id, room_id) VALUES (?, ?)', [userId, roomId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query("UPDATE rooms SET status = 'booked' WHERE id = ?", [roomId], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Room booked successfully' });
            });
        });
    });
});

// Cancel a booking
app.post('/cancel', (req, res) => {
    const { bookingId } = req.body;
    db.query('SELECT * FROM bookings WHERE id = ?', [bookingId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'Booking not found' });
        
        db.query('DELETE FROM bookings WHERE id = ?', [bookingId], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            db.query('UPDATE rooms SET booked = FALSE WHERE id = ?', [results[0].room_id]);
            res.json({ message: 'Booking canceled successfully' });
        });
    });
});

// View booking details
app.get('/bookings/:userId', (req, res) => {
    db.query('SELECT * FROM bookings WHERE user_id = ?', [req.params.userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Staff - Add a new room
app.post('/rooms', (req, res) => {
    const { roomNumber } = req.body;
    db.query('INSERT INTO rooms (room_number, booked) VALUES (?, FALSE)', [roomNumber], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Room added successfully', roomId: result.insertId });
    });
});

// Staff - Get all bookings
app.get('/all-bookings', (req, res) => {
    db.query('SELECT * FROM bookings', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Staff - Assign a room manually
app.post('/assign-room', (req, res) => {
    const { bookingId, roomId } = req.body;
    db.query('UPDATE bookings SET room_id = ? WHERE id = ?', [roomId, bookingId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        db.query('UPDATE rooms SET booked = TRUE WHERE id = ?', [roomId]);
        res.json({ message: 'Room assigned successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});