const Intern = require('../models/Intern');

// @desc    Đăng nhập hoặc Đăng ký (Find, Update or Create)
// @route   POST /api/auth/loginOrRegister
exports.loginOrRegister = async (req, res) => {
    try {
        const { name, specialization } = req.body;

        if (!name || !specialization) {
            return res.status(400).json({ success: false, message: 'Vui lòng cung cấp tên (name) và chuyên môn (specialization)' });
        }

        // 1. Tìm, cập nhật hoặc tạo mới
        // Logic này sẽ:
        // - Tìm intern theo 'name'.
        // - Nếu tìm thấy, CẬP NHẬT 'specialization' mới.
        // - Nếu không tìm thấy, TẠO MỚI với 'name' và 'specialization'.
        const intern = await Intern.findOneAndUpdate(
            { name }, 
            { name, specialization },
            { 
                new: true, 
                upsert: true, 
                runValidators: true 
            }
        );

        console.log(`User ${name} (Role: ${specialization}) đã đăng nhập/cập nhật.`);

        // 2. Tạo token và gửi về
        const token = intern.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            internId: intern._id,
            name: intern.name,
            specialization: intern.specialization
        });

    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ success: false, message: 'Tên này đã tồn tại (lỗi trùng lặp)' });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};