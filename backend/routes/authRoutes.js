// import express from 'express';
// import { register, login } from '../controllers/authController.js';
const {register,login} = require('../controllers/authController')
const express = require('express');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports=router;
