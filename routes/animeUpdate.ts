const express = require('express')
const router = express.Router();

const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

import User from '../models/User';
import Anime from '../models/Anime';

router.post('/anime/update/:name', jsonParser, async (req: any, res: any) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }

    const userfind = await User.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }

    const animeId = req.params.name;
    const foundAnime = await Anime.findOne({ name: animeId });

    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }

    foundAnime.name = req.body.name || foundAnime.name;
    foundAnime.description = req.body.description || foundAnime.description;
    foundAnime.coverImage = req.body.coverImage || foundAnime.coverImage;
    foundAnime.characters = req.body.characters || foundAnime.characters;
    foundAnime.editor = userfind.name;

    await foundAnime.save();
    return res.status(200).json(foundAnime);
});

export default router;