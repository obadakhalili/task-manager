const {
        addTask,
        getTasks,
        deleteTasks,
        getTask,
        updateTask,
        deleteTask
      } = require('../controllers/tasks.js');
const auth = require('../middlewares/auth.js');
const express = require('express');

const router = new express.Router();

router.route('/')
    .post(auth, addTask)
    .get(auth, getTasks)
    .delete(auth, deleteTasks);

router.route('/:id')
    .patch(auth, updateTask)
    .delete(auth, deleteTask);

module.exports = router;