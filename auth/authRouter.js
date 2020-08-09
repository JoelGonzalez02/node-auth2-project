const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secrets = require('../config/secrets');

const Users = require('../users/usersModel');


router.post('/register', (req, res) => {
    const credentials = req.body;

    if(Users.isValid(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 7;
        const hash = bcrypt.hashSync(credentials.password, rounds);
        credentials.password = hash;

        Users.add(credentials)
            .then(user => {
                const token = generateToken(user);
                res.status(201).json({data: user, token});
            })
            .catch(err => {
                res.status(500).json({message: err.message})
            })

    } else {
        res.status(400).json({message: 'Please provide a valid username and password'})
    }
});


router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if(Users.isValid(req.body)) {
        Users.findBy({username})
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)) {
                const token = generateToken(user);
                res.status(200).json({message: 'You are now logged in', token})
            } else {
                res.status(401).json({message: 'Please enter the correct username and password'})
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        })
    } else {
        res.status(400).json({message: 'please provide a username and password'})
    }
});




function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department
    };

    const options = {
        expiresIn: '1h'
    };

    return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;