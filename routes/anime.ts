const express = require('express')
const router = express.Router();

import Anime from '../models/Anime';

router.get('/animes',async function (req:any,res:any){
    let animes = await Anime.find({});
    res.status(200).send(animes);
});

export default router;