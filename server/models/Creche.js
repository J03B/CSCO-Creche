const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const crecheSchema = new Schema({
  crecheTitle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  crecheOrigin: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  crecheDescription: {
    type: String,
    minlength: 1,
    maxlength: 280,
    trim: true,
  },
  crecheImage: {
    type: String,
    required: true,
  },
  crecheUser: {
    type: String,
    required: true,
    trim: true,
  },
  yearsDonated: {
    type: [Number],
    maxlength: 4,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timestamp) => dateFormat(timestamp),
  },
});

const Creche = model('Creche', crecheSchema);

module.exports = Creche;
