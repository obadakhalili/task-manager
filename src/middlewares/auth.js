const User = require('../db/models/user.js');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const user = await User.findOne({ _id: await jwt.verify(token, process.env.JWT_SECRET)._id, 'tokens.token': token });
        if (!user) {
            throw Error;
        }
        req.user = user;
        req.token = token;
        next();
    } catch {
        res.clearCookie('token');
        res.redirect('/');
    }
};