const Intern = require('../models/Intern');

// @desc    Đăng nhập hoặc Đăng ký (Find or Create)
// @route   POST /api/auth/loginOrRegister
exports.loginOrRegister = async (req, res) => {
    try {
        const { name } = req.body; // ❌ Chỉ cần 'name'

        if (!name) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên (name)' });
        }

        // 1. Tìm Intern bằng Tên
        let intern = await Intern.findOne({ name });

        if (intern) {
            // 2. NẾU TÌM THẤY (Đăng nhập)
            console.log(`User ${name} đã đăng nhập.`);
        } else {
            // 3. NẾU KHÔNG TÌM THẤY (Đăng ký)
            intern = await Intern.create({
                name
                // ❌ Không cần 'role'
            });
            console.log(`User ${name} đã được tạo mới.`);
        }
        
        // 4. Tạo token và gửi về
        const token = intern.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            internId: intern._id
            // ❌ Không cần 'role'
        });

    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Tên này đã tồn tại (lỗi trùng lặp)' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};