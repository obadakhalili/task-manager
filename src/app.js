require('./db/mongodb.js');

const usersRouter = require('./routes/users.js');
const tasksRouter = require('./routes/tasks.js');
const auth = require('./middlewares/auth.js');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './templates/views');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

app.get(/^\/(login)?$/, (req, res) => {
    if (req.cookies.token) {
        return res.redirect('/dashboard');
    }
    res.render('login');
});
app.get('/dashboard', auth, (req, res) => res.render('dashboard', req.user));
app.get('/signup', (req, res) => res.render('signup'));
app.get('*', (req, res) => res.sendStatus(404));

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`));