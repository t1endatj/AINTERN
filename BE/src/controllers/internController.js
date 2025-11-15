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
