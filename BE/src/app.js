console.log("ENV MONGO_URI:", process.env.MONGO_URI)

const express = require('express')
const cors = require('cors')
require('dotenv').config()
require("./cron/taskCron");

const connectDB = require('./config/db')
connectDB()

const app = express()

app.use(cors({
    origin: 'http://localhost:5173', // Chấp nhận request từ Frontend
    methods: ['POST'],
}));
app.use(express.json())
const routes = require('./routes')
app.use('/api', routes)

app.get('/', (req, res) => {
    res.send('Backend chạy OK!')
})

app.listen(3000, () => {
    console.log("Server chạy port 3000")
})
