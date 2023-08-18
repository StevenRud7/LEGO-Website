'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var wishSchema = Schema( {
  userId: ObjectId,
  setID: ObjectId,
} );

module.exports = mongoose.model( 'WishList', wishSchema );
