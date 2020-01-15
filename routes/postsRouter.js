const express = require('express');

const Database = require('../data/db');

const router = express.Router();


module.exports = router


//Create post using information sent in request body
router.post('/', (req, res) => {
    const postData = req.body;

    if (!postData.title || !postData.contents)
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    Database.insert(postData)
        .then(post => res.status(201).json(post))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

//Create comment for the post using ID from the request body
router.post('/:id/comments', (req, res) => {
    const commentData = req.body;
    const postId = commentData.post_id;

    if (!commentData.text)
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    
    Database.findById(postId)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => console.log(err))
    
    Database.insertComment(commentData)
        .then(comment => res.status(201).json(comment))
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
})

//Get all posts
router.get('/', (req, res) => {
    Database.find()
        .then(posts => {
            console.log('Posts: ' + posts);
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

//Get specific post by ID
router.get('/:id', (req, res) => {
    const id = req.params.id;

    Database.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
                console.log('Post: ' + post);
                res.status(200).json(post);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

// //Return array of comments associated with the post with the specified ID
router.get('/:id/comments', (req, res) => {
    const id = req.body.post_id;

    Database.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
            Database.findPostComments(id)
                .then(comments => {
                    console.log("Comments: " + comments)
                    res.status(200).json(comments);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "The comments information could not be retrieved." })
                })
            }
        })
})

//Delete post
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    Database.findById(id)
        .then(post => {
            if (!post) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else {
            Database.remove(id)
                .then(comments => {
                    console.log("Comments: " + comments)
                    res.status(200).json(comments);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "The post could not be removed" })
                })
            }
    })
})

//Update post
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const postData = req.body;

    if (!postData.title || !postData.contents)
        res.status(400).json({ message: "Please provide title and contents for the post."})

    Database.findById(id)
    .then(post => {
        if (!post) {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
        }
    })
    .catch(err => console.log(err));

    Database.update(id, userdata)
        .then(update => res.status(200).json(update))
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The post information could not be modified." })
        })
})