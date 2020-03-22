const User = require('../db/models/user.js');
const helpers = require('../helpers.js');

exports.signup = async (req, res) => {
    try {
        const user = await new User(req.body).save();
        const token = await user.generateAuthToken();
        res.cookie('token', token);
        res.json({
            success: true,
            response: {
                token,
                user: helpers.filterObj(user._doc, ['_id', 'password', 'tokens', '__v'])
            }
        });
    } catch (e) {
        if (e.code === 11000) {
            res.json({ success: false, error: ['Email already exists'] });
        } else {
            res.json({ success: false, error: helpers.filterErrors(e.errors) });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie('token', token);
        res.json({ success: true });
    } catch {
        res.json({ success: false, error: 'Bad Credentials' });
    }
};

exports.logout = async (req, res) => {
    req.user.tokens = req.headers.type === 'all' ? [] : req.user.tokens.filter(e => e.token != req.token);
    res.clearCookie('token');
    await req.user.save();
    res.json({ success: true });
};

exports.updateAccount = async (req, res) => {
    try {
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        Object.entries(req.body).forEach(([key, val]) => {
            if (allowedUpdates.includes(key)) {
                req.user[key] = val;
            }
        });
        await req.user.save();
        res.json({ success: true });
    } catch (e) {
        if (e.code === 11000) {
            res.json({ success: false, error: ['Email already exists'] });
        } else {
            res.json({ success: false, error: helpers.filterErrors(e.errors) });
        }
    }
};

exports.deleteAccount = async (req, res) => {
    await req.user.delete();
    res.json({ success: true });
};