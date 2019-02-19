'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const entrySchema = mongoose.Schema({
  placeName: {type: String, required: true},
  address: {type: String, required: true},
  loc: {
    type: { type: String },
    coordinates: [Number],
  },
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  picture: {type: String},
  category: [{type: String}] 
});


entrySchema.methods.serialize = function() {
  return {
    id: this._id,
    placeName: this.placeName,
    address: this.address,
    loc: this.loc,
    comments: this.comments,
    date: this.date,
    picture: this.picture,
    category: this.category,
  };
};

const Entry = mongoose.model('Entry', entrySchema);

module.exports = {Entry};