const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const tableRoutes = require('./routes/tableRoutes')
const reservationRoutes = require('./routes/reservationRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).json({
    success: true,
    message: "Restaurant Reservation API is Running",
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/users', userRoutes)

module.exports = app

