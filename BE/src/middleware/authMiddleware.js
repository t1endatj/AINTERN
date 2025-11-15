const jwt = require('jsonwebtoken');
const Intern = require('../models/Intern');

// Middleware kiểm tra xem user đã đăng nhập hay chưa
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 

    if (!token) {
        return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập (Không tìm thấy token)' });
    }

    try {
        // Xác thực token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hackathon_secret_key_123');

        // Gắn thông tin user (Intern) vào request
        req.user = await Intern.findById(decoded.id);

        if (!req.user) {
             return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        next(); // Chuyển tiếp
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
};
