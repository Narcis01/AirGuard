const mongoose = require('mongoose');
/**
 * connect to MongoDb
 */
const connectDatabase = () => mongoose.connect(process.env.DB_URL).then(con => {
    console.log("Mongo is running");
});

module.exports = connectDatabase;