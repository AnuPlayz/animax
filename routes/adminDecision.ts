const express = require('express')
const router = express.Router();


const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

import Anime from '../models/Anime';


router.post('/admin/decision/:name', jsonParser, async (req: any, res: any) => {

    const anime = await Anime.findOne({ name: req.params.name });
    if (!anime) {
      return res.status(404).send('Anime not found');
    }
  
    if (req.body.decision === 'accept') {
      anime.proposalStatus = 'accepted';
    } else if (req.body.decision === 'reject') {
      anime.proposalStatus = 'rejected';
    }
  
    if(anime.proposalStatus == 'accepted'){
      await anime.save();
    }
    
    return res.status(200).json(anime.proposalStatus);
  });
  
export default router;