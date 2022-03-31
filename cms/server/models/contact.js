const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  imageUrl: { type: String },
  group: [{ type: mongoose.Schema.Types.String, ref: 'Contact' }]
});

module.exports = mongoose.model('Contact', contactSchema);
