const Task = require('../db/models/task.js');
const helpers = require('../helpers.js');

exports.addTask = async (req, res) => {
    try {
        await new Task({ ...req.body, owner: req.user._id }).save();
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false, error: helpers.filterErrors(e.errors)[0] });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.json({ success: true, tasks });
    } catch {
        res.json({ success: false, error: 'Internal Server Error' });
    }
};

exports.deleteTasks = async (req, res) => {
    await Task.deleteMany({ owner: req.user._id });
    res.json({ success: true });
};

exports.updateTask = async (req, res) => {
    try {
        await Task.findOneAndUpdate({ _id: req.params.id }, { ...req.body }, { runValidators: true });
        res.json({ success: true });
    } catch (e) {
        res.json({ success: false, error: helpers.filterErrors(e.errors)[0] });
    }
};

exports.deleteTask = async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id });
    res.json({ success: true });
};