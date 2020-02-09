const mongoose = require('mongoose');

class Security {

    signin(username, password) {
        return new Promise((resolve, reject) => {
            const UserModel = mongoose.model('User');
            UserModel.findOne({username, password}, (err, user) => {
                resolve(user);
            });
        });
    }

    signup(username, password) {
        return new Promise((resolve, reject) => {
            let userModel = mongoose.model('User');
            let user = new userModel();
            user.username = username;
            user.password = password;
            user.save((err) => {
                if (err !== null) reject(err);
                else resolve(user);
            });
        });
    }

}

module.exports = new Security();