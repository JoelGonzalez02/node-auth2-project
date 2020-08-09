const express = require('express');
const server = express();

const usersRouter = require('./users/usersRouter');
const authRouter = require('./auth/authRouter');

server.use(express.json());
server.use('/api/users', usersRouter);
server.use('/api/auth', authRouter);

module.exports = server;