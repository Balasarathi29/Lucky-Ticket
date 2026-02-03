
const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { generateTicket, getTickets, redeemTicket, getAvailableTickets, getUserTickets } = require('../controllers/ticketController');

router.post('/generate', protect, adminOnly, generateTicket);
router.get('/list', protect, adminOnly, getTickets);
router.post('/redeem', protect, redeemTicket);
router.get('/available', protect, getAvailableTickets);
router.get('/my-tickets', protect, getUserTickets);

module.exports = router;
