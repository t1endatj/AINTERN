const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },

    title: { type: String, required: true },
    requirement: { type: String, required: true },
    examples: { type: Array, default: [] },

    // Thêm trường này để lưu test cases từ template
    testcases: { type: Array, default: [] },

    order: { type: Number, required: true },

    isLocked: { type: Boolean, default: true },

    duration: { type: Number, default: 48 }, // 48h

    deadline: { type: Date },

    isExpired: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ['pending', 'done'],
        default: 'pending'
    },

    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Task', TaskSchema)