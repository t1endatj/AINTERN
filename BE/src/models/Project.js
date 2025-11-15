const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },
    title: { type: String, required: true },

    // Ngày bắt đầu thực tập
    startDate: { type: Date, default: Date.now },

    // Thời gian thực tập (ví dụ 30 ngày)
    duration: { type: Number, default: 30 }, 

    // trạng thái project
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'expired'],
        default: 'ongoing'
    },

    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Project', ProjectSchema)
