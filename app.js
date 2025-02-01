require('dotenv').config();

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');
const userRoutes = require('./routes/user.routes');
const fileRoutes = require('./routes/file.routes');
const cookieParser = require('cookie-parser');
const { default: mongoose } = require('mongoose');

const app = express();
connectDB();


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');  // Assuming 'home.ejs' is the main page
});


app.use('/skyvault', userRoutes);
app.use('/skyvault', fileRoutes);

const PORT =process.env.PORT || 3000;


mongoose
 .connect(process.env.MONGO_URI)
 .then((e)=> console.log('Connected to MongoDB'));


app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

