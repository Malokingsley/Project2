/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Song = require('./song')

// Here, we'll add our seed script
// this will seed our database for us, just like our seed route did
// the difference is, only an 'administrative' type of user can run this script
// this script will eventually be run with the command `npm run seed`



/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
    // array of starter resources(songs)
    const startSongs = [
        { title: 'Thriller' , artist: 'Michael Jackson' , albumName:'Thriller' , releaseDate:'1982' },
		{ title:'bold as love' , artist: 'Jimi Hendrix' , albumName:'bold as love', releaseDate:'1967'},
        { title: 'Love light in flight', artist:'Stevie Wonder' , albumName:'The woman in red' , releaseDate:'1984' },
        { title:'Dancing to the rhythm' , artist:'Stevie Wonder', albumName: 'Natural Wonder', releaseDate:'1995'},
        { title: 'Diary', artist: 'Alicia Keys', albumName:'The Diary of Alicia Keys' , releaseDate:'2003'},
        { title: 'Piano Man', artist:'Billy Joel' , albumName: 'Piano Man', releaseDate:'1973'},
        { title: 'Untitled 02', artist: 'kendrick Lamer', albumName:'untitled unmastered' , releaseDate:'2016' },
        { title: 'Complicated', artist: 'Robin Thicke', albumName: 'The Evolution of Robin Thicke', releaseDate:'2006' },
        { title: 'Would that make you love me', artist:'Robin Thicke' , albumName:'The Evolution of Robin Thicke' , releaseDate:'2006' },
        { title: 'Summertime', artist:'John Coltrane' , albumName:'My favorite things' , releaseDate:'1961' },
        { title: 'Misty', artist:'Donny Hathaway' , albumName:'Everything is everything' , releaseDate:'1970' },
        { title: 'Vultures', artist:'John Mayer' , albumName: 'Continuum' , releaseDate: '2006'},
        { title: 'I learned from the best', artist:'Whiney Houston' , albumName:'My love is yours' , releaseDate:'1998' },
        { title:'Skys the limit' , artist:'The Notorious B.I.G ' , albumName: 'Life after death', releaseDate: '1997'},
        { title: 'Playa Hater', artist:'The Notorious B.I.G' , albumName:'Life after death' , releaseDate:'1997' },
    ]
    // then we delete every songs in the database(all instances of this resource)
    // this will delete any songs that are not owned by a user
    Song.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter songs
            Song.create(startSongs)
                // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the songs created: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // always close the connection
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})