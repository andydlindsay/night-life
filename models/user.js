const mongoose = require('mongoose');

// user schema
const userSchema = mongoose.Schema({
    auth0_id: {
        type: String
    },
    search_term: {
        type: String
    },
    bars: [{
        business_id: {
            type: String
        },
        expires_at: {
            type: Date
        }
    }]
});

// export user
const User = module.exports = mongoose.model("User", userSchema, "users");