// import dependencies
const mongoose = require('../utils/connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const favsSchema = new Schema(
	{
		song: {
			type: Schema.Types.ObjectID,
			ref: 'Song',
		},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Fave = model('Fave', favsSchema)
/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Fave