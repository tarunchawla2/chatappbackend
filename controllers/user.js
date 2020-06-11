const bcrypt = require('bcryptjs');
const User = require('../models/user')
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    error: 'User already exists'
                })
            }
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    const user = new User({
                        username: req.body.username,
                        password: hash
                    })
                    user.save()
                        .then(result => {
                            res.status(201).json({
                                message: 'User created'
                            })
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: "Invalid authentication credentials"
                            })
                        })
                })
        })

}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    console.log(req.body.username)
    User.findOne({ username: req.body.username })
        .then((user) => {
            console.log(user)
            if (!user) {
                throw new Error('Username does not exist')
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            const token = jwt.sign({ username: fetchedUser.username, userId: fetchedUser._id },
                "MY_JWT_KEY")
            res.status(200).json({
                token: token,
                userId: fetchedUser._id,
                username: fetchedUser.username
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: err.message
            })
        })
}

exports.getAllusers = (req, res, next) => {
    User.find()
        .select('-password')
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({ message: error })
        })
}