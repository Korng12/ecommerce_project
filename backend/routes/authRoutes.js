// import express from 'express';
// import { register, login } from '../controllers/authController.js';
const {register,login,getAllUsers,me} = require('../controllers/authController')
const express = require('express');
const router = express.Router();
const verifyJwt = require('../middleware/authJwt');
router.post('/register', register);
router.post('/login', login);
router.get('/me',verifyJwt,me)

module.exports=router;
