const mongoose = require('mongoose')


const reservationSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    table :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Table',
        required: true,
    },

    reservationDate : {
        type : Date,
        required: [true, "Reservation data is required"]
    },

    startTime : {
        type : String,
        required : [true, "Start time is required"]
    },
      endTime: {
      type: String,
      required: [true, "End time is required"],
    },

    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "Guests must be at least 1"],
    },

    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
},
{
    timestamps: true,
} 
)

module.exports = mongoose.model("Reservation", reservationSchema, "reservation")