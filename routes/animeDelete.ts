const express = require('express')
const router = express.Router();

import User from '../models/User';
import Anime from '../models/Anime';

router.get('/anime/delete/:name', async (req: any, res: any) => {
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

    if (foundAnime.createdBy !== userfind.name) {
        return res.status(403).send('You do not have permission to delete this anime');
    }

    await foundAnime.deleteOne();
    return res.status(200).send('Anime deleted successfully');
});

export default router;