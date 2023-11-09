const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

import User from '../models/User';
import Anime from '../models/Anime';

router.post('/create', jsonParser, async (req:any, res:any) => {
    const usertoken = req.headers.authorization;
    if(!usertoken){
        return res.status(401).send("not logined");
    }
    const userfind = await User.findOne({token: usertoken});
    if(!userfind){
        return res.status(401).send("not valid user token");
    }

    const animeCreate = new Anime({
        name: req.body.name,
        description: req.body.description,
        coverImage: req.body.coverImage,
        characters: req.body.characters,
        createdBy: userfind.name,
        proposalStatus: 'queued',
    });
    
    const proposedAnime = await Anime.create(animeCreate);

    return res.status(200).json(proposedAnime);
});

export default router;