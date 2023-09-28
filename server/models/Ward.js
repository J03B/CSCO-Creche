const { Schema, model } = require('mongoose');

const wardSchema = new Schema({
  wardName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    trim: true,
  },
  stakeName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 100,
    trim: true,
  },
});

const Ward = model('Ward', wardSchema);

module.exports = Ward;
