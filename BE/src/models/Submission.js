const mongoose = require('mongoose')

const SubmissionSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    internId: { type: mongoose.Schema.Types.ObjectId, ref: 'Intern', required: true },

    code: { type: String, required: true },
    language: { type: String, default: 'javascript' },

    // Kết quả chấm (đồng bộ với controller)
    passed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    feedback: { type: String, default: '' },


    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Submission', SubmissionSchema)