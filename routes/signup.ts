const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

import User from '../models/User';

router.post('/signup', jsonParser, (req:any, res:any) => {
    const userCreate = new User({
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio
    });
    userCreate.save();
    return res.status(200).json(userCreate);
});

export default router;