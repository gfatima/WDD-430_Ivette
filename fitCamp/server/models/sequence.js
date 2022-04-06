const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
  maxOrderId: { type: Number, required: true },
  maxClientId: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
