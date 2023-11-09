import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import Anime from '../models/Anime';
import User from '../models/User';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

router.post('/:name/comment', jsonParser, async (req: Request, res: Response) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send('Not logged in');
    }

    const user = await User.findOne({ token: usertoken });
    if (!user) {
        return res.status(401).send('Not a valid user token');
    }

    const anime = await Anime.findOne({ name: req.params.name });
    if (!anime) {
        return res.status(404).send('Anime not found');
    }

    const newComment = {
        user: user._id,
        comment: req.body.comment,
    };

    anime.comments.push(newComment);

    await anime.save();

    return res.status(200).json(anime.comments);
});

export default router;
