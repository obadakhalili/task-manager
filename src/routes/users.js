const { signup,
        login,
        logout,
        updateAccount,
        deleteAccount
      } = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');
const express = require('express');

const router = new express.Router();

router.post('/login', login);
router.post('/logout', auth, logout);

router.route('/')
    .post(signup)
    .patch(auth, updateAccount)
    .delete(auth, deleteAccount);

module.exports = router;