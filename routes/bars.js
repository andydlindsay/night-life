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

// export router
module.exports = router;