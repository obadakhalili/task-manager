const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
});