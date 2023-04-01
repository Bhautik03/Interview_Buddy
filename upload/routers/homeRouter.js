const express = require('express');
const Router = express.Router();
const homeSchema = require('../models/homeSchema');
const profileSchema = require("../models/profileSchema");

//const Register = require("./models/homeSchema");

Router.get('/', (err,res) => {
    res.render('login')
})

module.exports = Router;