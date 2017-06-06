const express = require('express'),
      router = express.Router(),
      yelp = require('yelp-fusion');

// retrieve bars by location
router.get('/search/:location', (req, res) => {
    const clientId = process.env.YELP_CLIENT_ID;
    const clientSecret = process.env.YELP_CLIENT_SECRET;
    const category = 'bars';
    const skip = (req.query.currentpage - 1) * req.query.itemsperpage;
    const searchRequest = {
        location: req.params.location,
        categories: category,
        limit: req.query.itemsperpage,
        offset: skip
    }
    const client = yelp.client(process.env.YELP_ACCESS_TOKEN);
    client.search(searchRequest).then(response => {
        console.log(response);
        res.send(response.jsonBody);
    }).catch(e => {
        console.error(e);
    });
});

// export router
module.exports = router;