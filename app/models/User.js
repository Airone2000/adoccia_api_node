const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const identifier = Schema.ObjectId;

const User = new Schema({
    id: identifier,
    username: {type: String},
    password: {type: String}
});

mongoose.model('User', User);
