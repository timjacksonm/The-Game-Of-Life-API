const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: Array,
    required: true,
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

TemplateSchema.statics.isUniqueTitle = function isUniqueTitle(string) {
  return this.find({ title: string }).then((result) => {
    if (result.length) {
      throw new Error();
    } else {
      return true;
    }
  });
};

module.exports = mongoose.model('CustomTemplates', TemplateSchema);
