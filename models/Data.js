const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;