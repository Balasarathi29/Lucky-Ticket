
const LuckyTicket = require('../models/LuckyTicket');
const User = require('../models/User');

// Generate Lucky Tickets
const generateTicket = async (req, res) => {
    try {
        const { reward } = req.body;

        if (!reward || isNaN(reward)) {
            return res.status(400).json({ message: 'Invalid reward amount' });
        }

        // Generate a random 8-character alphanumeric code
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();

        const ticket = await LuckyTicket.create({
            code,
            reward
        });

        res.status(201).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List all tickets
const getTickets = async (req, res) => {
    try {
        const tickets = await LuckyTicket.find({}).sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Redeem a ticket

const redeemTicket = async (req, res) => {
    try {
        const { code } = req.body;
        // req.user is set by the protect middleware
        const user = req.user;

        if (!code) {
            return res.status(400).json({ message: 'Please provide code' });
        }

        // Atomic Check and Update to prevent race conditions
        const ticket = await LuckyTicket.findOneAndUpdate(
            { code: code, isUsed: false },
            {
                $set: {
                    isUsed: true,
                    usedBy: user.email, // Tracking by email or ID is safer
                    usedAt: new Date()
                }
            },
            { new: true }
        );

        if (!ticket) {
            const existingTicket = await LuckyTicket.findOne({ code });
            if (existingTicket) {
                return res.status(400).json({ message: 'This ticket has already been redeemed' });
            }
            return res.status(404).json({ message: 'Invalid ticket code' });
        }

        // Update User Points
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $inc: { points: ticket.reward } },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Success! You earned ${ticket.reward} points`,
            data: {
                ticket,
                userPoints: updatedUser.points
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List available tickets (unredeemed) - accessible by users
const getAvailableTickets = async (req, res) => {
    try {
        const tickets = await LuckyTicket.find({ isUsed: false }).select('code').sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// List tickets redeemed by the current user
const getUserTickets = async (req, res) => {
    try {
        const user = req.user;
        const tickets = await LuckyTicket.find({ usedBy: user.email }).select('code reward usedAt').sort({ usedAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generateTicket,
    getTickets,
    redeemTicket,
    getAvailableTickets,
    getUserTickets
};
