const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    title: { type: String, required: true },
    requirement: { type: String, required: true },
    examples: { type: Array, default: [] },

    order: { type: Number, required: true },

    // Task mở khi isLocked = false
    isLocked: { type: Boolean, default: true },

    // thời gian làm task (tính bằng giờ)
    duration: { type: Number, default: 48 }, // 48h

    // Deadline sẽ set khi task được unlock
    deadline: { type: Date },

    // task hết hạn
    isExpired: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending'
    },

    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Task', TaskSchema)
