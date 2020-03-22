const Task = require('./task.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [25, 'Exceeded maximum length of 25 characters for name']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator(value) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },
            message: 'Email is not valid'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [7, 'Password length must be at least 7'],
        maxlength: [72, 'Exceeded maximum length of 72 characters for password']
    },
    age: {
        type: Number,
        min: [1, 'You should be at least a year old to use our platform'],
        max: [135, 'Age cannot exceed 135 years']
    },
    tokens: [{
        token: {
            type: String
        }
    }]
});

userSchema.virtual('tasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function() {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens.push({ token });
    await this.save();
    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !await bcryptjs.compare(password, user.password)) {
        throw Error;
    }
    return user;
};

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8);
    }
    next();
});

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ owner: this._id });
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;