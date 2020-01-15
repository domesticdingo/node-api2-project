const express = require('express');

const postsRouter = require('../routes/postsRouter.js');

const server = express();
server.use(express.json());

//Endpoints
server.get('/', (req, res) => {
    res.send({ hello: "It's alive" })
})

//Requests to routes that begin with /api/posts
server.use('/api/posts', postsRouter)

module.exports = server;