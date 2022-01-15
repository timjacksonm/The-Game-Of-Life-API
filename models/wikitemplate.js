const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: Array,
  },
  size: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  rleString: {
    type: String,
    required: true,
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WikiTemplate', TemplateSchema);
