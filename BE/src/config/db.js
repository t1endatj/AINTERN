const mongoose = require('mongoose')

async function connectDB() {
    const uri = process.env.MONGO_URI

    if (!uri) {
        console.error("❌ Không tìm thấy MONGO_URI trong file .env")
        process.exit(1)
    }

    try {
        console.log("🔄 Đang kết nối MongoDB...")

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("✅ Đã kết nối MongoDB thành công!")
    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error.message)
        process.exit(1)
    }
}

module.exports = connectDB
