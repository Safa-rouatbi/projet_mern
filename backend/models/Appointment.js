
const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true},

    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true},

    date:{
        type: Date,
        required:true
    },
    status:{
        type:String,
        enum:['scheduled','completed','canceled']},
    notes: {
      type: String,
      default: "",
    }},

    {timestamps:true}
     );

module.exports = mongoose.model('Appointment', appointmentSchema);