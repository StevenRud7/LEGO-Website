'use strict';
const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;


var legoSchema = Schema( {
    Set_Number: Number,
    Name: String,
    Release_Year: Number,
    Price: Number,
    Pieces: Number,
    Image: String,
    Tags: String,
} );

module.exports = mongoose.model( 'LEGO', legoSchema );