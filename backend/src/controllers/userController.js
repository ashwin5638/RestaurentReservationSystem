const bcrypt = require('bcryptjs')
const User = require('../models/User')

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const updateData = {}
    if (name) updateData.name = name
    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user._id } })
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' })
      }
      updateData.email = email
    }
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' })
    }
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select('-password')
    res.status(200).json({ success: true, message: 'Profile updated successfully', user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

module.exports = {
  getProfile,
  updateProfile,
}
