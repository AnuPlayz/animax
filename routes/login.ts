const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

import User from '../models/User';

router.post('/login', jsonParser, async (req:any, res:any) => {
    const username = req.body.name;
    const userpass = await User.findOne({name: username});
    if(!userpass){
         res.status(404).send("not found user");
    }
    else if(userpass.password == req.body.password){
        let token = (Math.random() + 1).toString(36).substring(7);
        userpass.token = token;
        await userpass.save();
        res.status(200).send("logged in and updated user token");
    }
});

export default router;