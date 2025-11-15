const Intern = require('../models/Intern')

exports.createIntern = async (req, res) => {
    try {
        const intern = await Intern.create(req.body)
        res.json({ success: true, data: intern })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}

exports.getAllInterns = async (req, res) => {
    try {
        const interns = await Intern.find()
        res.json({ success: true, data: interns })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

// Lấy 1 intern theo ID
exports.getInternById = async (req, res) => {
    try {
        const intern = await Intern.findById(req.params.id)
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy intern' })
        }
        res.json({ success: true, data: intern })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

// Cập nhật thông tin intern
exports.updateIntern = async (req, res) => {
    try {
        const intern = await Intern.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!intern) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy intern' })
        }
        res.json({ success: true, data: intern })
    } catch (error) {
        res.status(400).json({ success: false, error: error.message })
    }
}
