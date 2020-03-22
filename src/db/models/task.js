const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    descreption: {
        type: String,
        required: [true, 'Descreption is required']
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'users'
    }
}, { timestamps: true });

const Task = mongoose.model('tasks', taskSchema);

module.exports = Task;