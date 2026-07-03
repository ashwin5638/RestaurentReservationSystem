const express = require('express')
const {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  cancelReservation,
  checkAvailability,
  getMyReservations,
} = require('../controllers/reservationController')
const authenticate = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/availability', authenticate, checkAvailability)
router.get('/me', authenticate, getMyReservations)
router.get('/', authenticate, getReservations)
router.get('/:id', authenticate, getReservation)
router.post('/', authenticate, createReservation)
router.put('/:id', authenticate, updateReservation)
router.patch('/:id/cancel', authenticate, cancelReservation)
router.delete('/:id', authenticate, cancelReservation)

module.exports = router
