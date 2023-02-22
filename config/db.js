'use strict'

// creating a base name for the mongodb
// REPLACE THE STRING WITH YOUR OWN DATABASE NAME
const mongooseBaseName = 'MusicSea-fullstack'

// create the mongodb uri for development and test
const database = {
	development: `mongodb://localhost/${mongooseBaseName}-development`,
	test: `mongodb://localhost/${mongooseBaseName}-test`,
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable MONGODB_URI will be available in
// production evironment otherwise use test or development db
const currentDb = process.env.MONGODB_URI || 8080

// mongodb+srv://mongoDbUser:userpassword@organizationname0.j6ixp.mongodb.net/databasename?retryWrites=true&w=majority

module.exports = currentDb

