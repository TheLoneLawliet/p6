// SECRETS
const mdbServer = '';
//
const express = require('express');
const mongoose = require('mongoose')
const path = require('path');


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce')


const app = express();
app.use(express.json());




mongoose.connect(mdbServer).then(
    () => {
        console.log('Connected To MongoDB ATLAS!');
    }
).catch(
    (error) => {
        console.log('FAILED TO CONECT !!');
        console.error(error);
    });





app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;