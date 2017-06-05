const express = require('express'),
      router = express.Router(),
      User = require('../models/user');

// add search term
router.put('/:id/newsearchterm', (req, res) => {
    const query = { 'user_id': req.params.id };
    const newSearchTerm = req.body;
    // check database for user
    // User.findOne(query, );

});