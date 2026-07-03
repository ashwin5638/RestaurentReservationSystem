const Reservation = require('../models/Reservation')
const Table = require('../models/Table')

const formatReservation = (doc) => {
  if (!doc) return doc
  const obj = doc.toObject ? doc.toObject() : doc
  const d = obj.reservationDate ? new Date(obj.reservationDate) : null
  return {
    ...obj,
    date: d ? d.toISOString().split('T')[0] : obj.date,
    timeSlot: obj.startTime && obj.endTime ? `${obj.startTime}-${obj.endTime}` : obj.timeSlot,
    status: obj.status ? obj.status.toLowerCase() : obj.status,
  }
}

const parseTimeSlot = (timeSlot) => {
  if (!timeSlot || !timeSlot.includes('-')) return { startTime: null, endTime: null }
  const [startTime, endTime] = timeSlot.split('-')
  return { startTime, endTime }
}

const getReservations = async (req, res) => {
  try {
    let filter = {}
    if (req.user.role !== 'admin') {
      filter.user = req.user._id
    }
    if (req.query.date) {
      const d = new Date(req.query.date)
      d.setHours(0, 0, 0, 0)
      const end = new Date(req.query.date)
      end.setHours(23, 59, 59, 999)
      filter.reservationDate = { $gte: d, $lte: end }
    }
    if (req.query.status) {
      filter.status = req.query.status
    }
    const reservations = await Reservation.find(filter)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations.map(formatReservation),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'tableNumber capacity')
      .sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations.map(formatReservation),
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const checkAvailability = async (req, res) => {
  try {
    const { date, timeSlot, guests } = req.query
    if (!date || !timeSlot) {
      return res.status(400).json({ success: false, message: 'Date and timeSlot are required' })
    }
    const { startTime, endTime } = parseTimeSlot(timeSlot)
    if (!startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Invalid timeSlot format (use HH:MM-HH:MM)' })
    }

    const guestCount = parseInt(guests, 10) || 1
    const dateStart = new Date(date)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(date)
    dateEnd.setHours(23, 59, 59, 999)

    const bookedTableIds = await Reservation.find({
      status: 'confirmed',
      reservationDate: { $gte: dateStart, $lte: dateEnd },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    }).distinct('table')

    const availableTables = await Table.find({
      _id: { $nin: bookedTableIds },
      isActive: true,
      capacity: { $gte: guestCount },
    }).sort({ tableNumber: 1 })

    res.status(200).json({ success: true, data: availableTables })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }
    if (req.user.role !== 'admin' && reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this reservation' })
    }
    res.status(200).json({ success: true, reservation: formatReservation(reservation) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const createReservation = async (req, res) => {
  try {
    const { table: tableId, date, timeSlot, reservationDate, startTime, endTime, guests } = req.body

    const finalDate = date || reservationDate
    const { startTime: sTime, endTime: eTime } = timeSlot ? parseTimeSlot(timeSlot) : { startTime, endTime }

    if (!tableId || !finalDate || !sTime || !eTime || !guests) {
      return res.status(400).json({ success: false, message: 'All fields are required' })
    }

    const table = await Table.findById(tableId)
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' })
    }
    if (guests > table.capacity) {
      return res.status(400).json({ success: false, message: `Table capacity is ${table.capacity}, but ${guests} guests requested` })
    }

    const dateStart = new Date(finalDate)
    dateStart.setHours(0, 0, 0, 0)
    const dateEnd = new Date(finalDate)
    dateEnd.setHours(23, 59, 59, 999)

    const overlapping = await Reservation.findOne({
      table: tableId,
      status: 'confirmed',
      reservationDate: { $gte: dateStart, $lte: dateEnd },
      $or: [
        { startTime: { $lt: eTime }, endTime: { $gt: sTime } },
      ],
    })

    if (overlapping) {
      return res.status(400).json({ success: false, message: 'Table is already booked for this time slot' })
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      table: tableId,
      reservationDate: new Date(finalDate),
      startTime: sTime,
      endTime: eTime,
      guests,
    })

    const populated = await Reservation.findById(reservation._id)
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')

    res.status(201).json({ success: true, message: 'Reservation created successfully', reservation: populated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this reservation' })
    }
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Cannot update a cancelled reservation' })
    }

    const { table: tableId, date, timeSlot, reservationDate, startTime, endTime, guests, status } = req.body
    const updateData = {}

    if (tableId) updateData.table = tableId
    if (date || reservationDate) updateData.reservationDate = new Date(date || reservationDate)
    if (status) updateData.status = status

    if (timeSlot) {
      const parsed = parseTimeSlot(timeSlot)
      if (parsed.startTime) updateData.startTime = parsed.startTime
      if (parsed.endTime) updateData.endTime = parsed.endTime
    } else {
      if (startTime) updateData.startTime = startTime
      if (endTime) updateData.endTime = endTime
    }
    if (guests) updateData.guests = guests

    const updated = await Reservation.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('user', 'name email')
      .populate('table', 'tableNumber capacity')

    res.status(200).json({ success: true, message: 'Reservation updated successfully', reservation: updated })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' })
    }
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this reservation' })
    }
    if (reservation.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Reservation is already cancelled' })
    }

    reservation.status = 'cancelled'
    await reservation.save()

    res.status(200).json({ success: true, message: 'Reservation cancelled successfully', reservation })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getReservations,
  getMyReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  checkAvailability,
}
