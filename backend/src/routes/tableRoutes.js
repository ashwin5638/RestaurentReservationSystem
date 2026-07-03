const express = require('express')
const {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController')
const authenticate = require('../middleware/authMiddleware')
const authorizeAdmin = require('../middleware/adminMiddleware')

const router = express.Router()

router.get('/', authenticate, getTables)
router.get('/:id', authenticate, getTable)
router.post('/', authenticate, authorizeAdmin, createTable)
router.put('/:id', authenticate, authorizeAdmin, updateTable)
router.delete('/:id', authenticate, authorizeAdmin, deleteTable)

module.exports = router
