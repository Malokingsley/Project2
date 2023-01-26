// import dependencies
const mongoose = require('../utils/connection')
const favsSchema = require('./fav')


// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const MusiqSchema = new Schema(
	{
		title: { type: String,},
		artist: { type: String,},
        albumName: { type: String},
		releaseDate: { type: String},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Song = model('Song', MusiqSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Song
