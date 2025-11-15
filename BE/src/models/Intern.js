const mongoose = require('mongoose')

const InternSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Intern', InternSchema)
