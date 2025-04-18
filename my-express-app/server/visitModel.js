const mongoose = require('mongoose');
const visitSchema = new mongoose.Schema({ visited:Boolean });
module.exports = mongoose.model('Visit', visitSchema);
