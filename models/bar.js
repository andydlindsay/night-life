const mongoose = require('mongoose');

// bar schema
const barSchema = mongoose.Schema({
    sub: {
        type: String
    },
    business_id: {
        type: String
    },
    expires_at: {
        type: Date
    }
});

// export bar
const Bar = module.exports = mongoose.model("Bar", barSchema, "bars");