// Import Dependencies
const express = require('express')
const Song = require('../models/song')
// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, faveed out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// Routes

// index ALL
router.get('/', (req, res) => {
	Song.find({})
		.then(songs => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			
			res.render('songs/index', { songs, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's songs
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Song.find({ owner: userId })
		.then(songs => {
			res.render('songs/index', { songs, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('songs/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Song.create(req.body)
		.then(song => {
			console.log('this was returned from create', song)
			res.redirect('/songs')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const songId = req.params.id
	Song.findById(songId)
		.then(song => {
			res.render('songs/edit', { song })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})

})

// update route
router.put('/:id', (req, res) => {
	const songId = req.params.id

	// Song.findByIdAndUpdate(songId, req.body, { new: true })
	// 	.then(song => {
	// 		res.redirect(`/songs/${song.id}`)
	// 	})
	// 	.catch((error) => {
	// 		res.redirect(`/error?error=${error}`)
	// 	})
	Song.findById(id)
        .then(song => {
            // if the owner of the song is the person who is logged in
            if (song.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // update and save the song
                return song.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20song`)
            }
        })
        .then(() => {
            
            res.redirect(`/songs/mine`)
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// show route
router.get('/:id', (req, res) => {
	const songId = req.params.id
	Song.findById(songId)
		.then(song => {
            const {username, loggedIn, userId} = req.session
			res.render('songs/show', { song, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const songId = req.params.id
	Song.findByIdAndRemove(songId)
		.then(song => {
			res.redirect('/songs')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
