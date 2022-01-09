const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  author: {
    type: String,
    minlength: 1,
    maxLength: 30,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    minlength: 1,
    maxLength: 30,
    trim: true,
    required: true,
  },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('TemplateSchema', TemplateSchema);
