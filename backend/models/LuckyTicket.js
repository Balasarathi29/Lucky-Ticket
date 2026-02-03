
const mongoose = require('mongoose');

const luckyTicketSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    reward: {
        type: Number,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    usedBy: {
        type: String, // Store user name or ID. Based on prompt "Save user name in usedBy"
        default: null
    },
    usedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LuckyTicket', luckyTicketSchema);
