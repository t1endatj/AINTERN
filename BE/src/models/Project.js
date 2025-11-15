const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    title: { type: String, required: true },

    // VAI TRÒ CHUYÊN MÔN (Specialization)
    // Lưu trữ vai trò của Intern TRONG dự án này
    specialization: {
        type: String,
        enum: ['front_end', 'back_end'], // Thêm full_stack cho tương lai
        required: true
    },

    // Ngày bắt đầu thực tập
    startDate: { type: Date, default: Date.now },
    // ... (các trường status, duration, createdAt giữ nguyên)
    duration: { type: Number, default: 30 }, 
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'expired'],
        default: 'ongoing'
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Project', ProjectSchema)