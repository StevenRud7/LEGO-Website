'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var ownSchema = Schema( {
  userId: ObjectId,
  setID: ObjectId,
} );

module.exports = mongoose.model( 'OwnedList', ownSchema );
