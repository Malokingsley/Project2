// Import Dependencies
const express = require('express')
const Fav = require('../models/fav')
const Song = require('../models/song')
/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////
// Subdocuments are not mongoose models. That means they don't have their own collection, and they don't come with the same model methods that we're used to(they have some their own built in.)
// This also means, that a subdoc is never going to be viewed without it's parent document. We'll never see a comment without seeing the song it was commented on first.

// This also means, that when we make a subdocument, we must MUST refer to the parent so that mongoose knows where in mongodb to store this subdocument

// POST -> `/comments/<someFruitId>`
// only loggedin users can post comments
// bc we have to refer to a song, we'll do that in the simplest way via the route
router.post('/:songID', (req, res) => {
    // first we get the songID and save to a variable
    const songID = req.params.songID

    req.body.fav = req.body.fav === 'on' ? true : false
    // then we'll protect this route against non-logged in users
    console.log('this is the session\n', req.session)
    if (req.session.loggedIn) {
        // if logged in, make the logged in user the author of the comment
        // this is exactly like how we added the owner to our songs
        req.body.owner = req.session.userId
        // saves the req.body to a variable for easy reference later
        const theComment = req.body
        // find a specific song
        Song.findById(songID)
            .then(song => {
                // create the comment(with a req.body)
               //song.fav.push(theComment)
               console.log('this is', song)
               
               theComment.fav = true
               console.log(theComment)
               

               console.log(songID)
                // save the song
                return song.save()
            })
            // respond with a 201 and the song itself
            .then(song => {
                // res.status(201).json({ song: song })
                res.redirect(`/songs/mine`)
            })
            // catch and handle any errors
            .catch(err => {
                console.log(err)
                // res.status(400).json(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        // res.sendStatus(401) //send a 401-unauthorized
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20fruit`)
    }
})

// DELETE -> `/comments/delete/<someFruitId>/<someCommentId>`
// make sure only the author of the comment can delete the comment
router.delete('/delete/:songID/:commId', (req, res) => {
    // isolate the ids and save to variables so we don't have to keep typing req.params
    // const songID = req.params.songID
    // const commId = req.params.commId
    const { songID, commId } = req.params
    // get the song
    Song.findById(songID)
        .then(song => {
            // get the comment, we'll use the built in subdoc method called .id()
            const theComment = song.comments.id(commId)
            console.log('this is the comment to be deleted: \n', theComment)
            // then we want to make sure the user is loggedIn, and that they are the author of the comment
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (theComment.author == req.session.userId) {
                    // we can use another built in method - remove()
                    theComment.remove()
                    song.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/favs/${fav.id}`)
                } else {
                    // otherwise send a 401 - unauthorized status
                    // res.sendStatus(401)
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
            }
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router