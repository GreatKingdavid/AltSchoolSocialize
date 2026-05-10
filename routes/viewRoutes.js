const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ state: 'published' }).populate('author', 'username');
        res.render('index', { posts });
    } catch (err) {
        res.send("Error loading feed");
    }
});

module.exports = router;