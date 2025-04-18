const mongoose = require('mongoose');
const spotSchema = new mongoose.Schema({
  seatId:    { type:String, required:true, unique:true },
  status:    { type:String, enum:['unoccupied','occupied'], default:'unoccupied' },
  clientid:  String,
  lastUpdated:Date
});
module.exports = mongoose.model('Spot', spotSchema);
