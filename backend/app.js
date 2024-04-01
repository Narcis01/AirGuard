const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/errors');
const ErrorHandler = require('./utils/errorHandler')

//set up config file
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

//connect to database
const connectDatabse = require('./config/databse');
connectDatabse();
//cors
app.use(cors());
//body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Cookie parser
app.use(cookieParser());

//import route
const dataRoute = require('./routes/data');
const auth = require('./routes/auth');
const address = require('./routes/address');
app.use('/api/v1', dataRoute);
app.use('/api/v1', auth);
app.use('/api/v1', address);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//Middleware handle errors
app.use(errorMiddleware);

//seting port
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server started with port ${PORT} with ${process.env.NODE_ENV} mode`);
})