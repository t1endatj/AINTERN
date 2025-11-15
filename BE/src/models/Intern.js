const mongoose = require('mongoose')
const jwt = require('jsonwebtoken') 

const InternSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true, // Đảm bảo tên không trùng
        trim: true
    },
    level: { 
        type: Number, 
        default: 1 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})

InternSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, name: this.name }, // Chỉ cần id và name
        process.env.JWT_SECRET || 'hackathon_secret_key_123', 
        { expiresIn: '30d' }
    );
};

module.exports = mongoose.model('Intern', InternSchema)