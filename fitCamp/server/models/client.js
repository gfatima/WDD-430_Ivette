const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  imageUrl: { type: String },
});

module.exports = mongoose.model('clients', clientSchema);
