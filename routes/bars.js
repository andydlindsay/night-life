const express = require('express'),
      router = express.Router(),
      Bar = require('../models/bar');

// save record
router.post('/going', (req, res) => {
    let newBar = new Bar({
        sub: req.body.sub,
        business_id: req.body.business_id,
        expires_at: req.body.expires_at
    });
    newBar.save((err) => {
        if (err) {
            console.error(err);
            res.json({ success: false, msg: 'Failed to record bar' });
        } else {
            res.json({ success: true, msg: 'Bar recorded' });
        }
    });
});

// count going
router.get('/count/:business_id', (req, res) => {
    const business_id = req.params.business_id;
    // res.json({ business_id });
    Bar.count({
        business_id,
        expires_at: {
            $gte: new Date()
        } 
    }, (err, count) => {
        res.json({ count });
    });
});

// is user going
router.get('/isgoing', (req, res) => {
    const sub = req.query.sub;
    const business_id = req.query.business_id;
    // res.json({ sub, business_id });
    Bar.findOne({
        business_id,
        sub,
        expires_at: {
            $gte: new Date()
        }
    }, (err, bar) => {
        if (bar == null) {
            res.json({ 'going': false });
        } else {
            res.json({ 'going': true });
        }
    });
});

// not going
router.delete('/going', (req, res) => {
    const sub = req.query.sub;
    const business_id = req.query.business_id;
    Bar.find({
        sub,
        business_id,
        expires_at: {
            $gte: new Date()
        }
    }).remove((err, bar) => {
        if (err) throw err;
        res.json({ bar });
        // if (bar.n == 0) {
        //     res.json({ 'success': false });
        // } else {
        //     res.json({ 'success': true });
        // }
    });
});

// export router
module.exports = router;