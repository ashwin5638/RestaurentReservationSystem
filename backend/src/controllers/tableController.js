const Table = require('../models/Table')

const getTables = async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 })
    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const getTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id)
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' })
    }
    res.status(200).json({ success: true, data: table })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const createTable = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body
    if (!tableNumber || !capacity) {
      return res.status(400).json({ success: false, message: 'Table number and capacity are required' })
    }
    const existing = await Table.findOne({ tableNumber })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Table number already exists' })
    }
    const table = await Table.create({ tableNumber, capacity })
    res.status(201).json({ success: true, message: 'Table created successfully', data: table })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateTable = async (req, res) => {
  try {
    const { tableNumber, capacity, isActive } = req.body
    const updateData = {}
    if (tableNumber !== undefined) updateData.tableNumber = tableNumber
    if (capacity !== undefined) updateData.capacity = capacity
    if (isActive !== undefined) updateData.isActive = isActive
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' })
    }
    res.status(200).json({ success: true, message: 'Table updated successfully', data: table })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!table) {
      return res.status(404).json({ success: false, message: 'Table not found' })
    }
    res.status(200).json({ success: true, message: 'Table deactivated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getTables,
  getTable,
  createTable,
  updateTable,
  deleteTable,
}
