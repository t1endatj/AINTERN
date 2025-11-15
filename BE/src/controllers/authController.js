const Intern = require('../models/Intern');

// @desc    Đăng nhập hoặc Đăng ký (Find, Update or Create)
// @route   POST /api/auth/loginOrRegister
exports.loginOrRegister = async (req, res) => {
    try {
        const { name, specialization } = req.body;

        console.log('🔐 Login/Register request:', { name, specialization });

        if (!name || !specialization) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên (name) và chuyên môn (specialization)' });
        }

        // 1. Tìm theo cả name VÀ specialization, hoặc tạo mới
        const intern = await Intern.findOneAndUpdate(
            { name, specialization }, 
            { name, specialization },
            { 
                new: true, 
                upsert: true, 
                runValidators: true 
            }
        );

        console.log('✅ User created/updated:', intern._id, intern.name, intern.specialization);

        // 2. Tạo token và gửi về
        const token = intern.getSignedJwtToken();

        const response = {
            success: true,
            token,
            internId: intern._id,
            name: intern.name,
            specialization: intern.specialization
        };

        console.log('📤 Sending response:', response);

        res.status(200).json(response);

    } catch (error) {
        console.error('❌ Error in loginOrRegister:', error);
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Tên này đã tồn tại (lỗi trùng lặp)' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};