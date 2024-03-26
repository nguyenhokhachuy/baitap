var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
var jsonwebtoken = require("jsonwebtoken");
const config = require('../configs/config');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: [String],
        default: ["USER"]
    },
    status: {
        type: Boolean,
        default: true
    },
    email: String
}, { timestamps: true })

userSchema.pre('save', function () {
    this.password = bcrypt.hashSync(this.password, 10);
})

userSchema.methods.getJWT = function () {
    var token = jsonwebtoken.sign({ id: this._id }, config.SECRET_KEY, {
        expiresIn: config.EXPIRE_JWT
    });
    return token;
}

userSchema.statics.GetCre = async function (username, password) {
    if (!username || !password) {
        return { error: "phai dien day du username va password" };
    }
    var user = await this.findOne({ username: username });
    if (!user) {
        return { error: "user hoac password sai" };
    }
    if (bcrypt.compareSync(password, user.password)) {
        return user;
    } else {
        return { error: "user hoac password sai" };
    }
}

module.exports = new mongoose.model('user', userSchema);