const express = require('express')
const router = express.Router();

import Anime from '../models/Anime';

router.get('/anime/:id', async (req: any, res: any) => {
    const animeId = req.params.id;
    const foundAnime = await Anime.findOne({name: animeId});

    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    return res.status(200).json(foundAnime);
});

export default router;