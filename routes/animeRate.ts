import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import Anime from '../models/Anime';
import User from '../models/User';

const router: Router = express.Router();
const jsonParser = bodyParser.json();

router.post('/:name/rate', jsonParser, async (req: Request, res: Response) => {
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

    // Check if the user has already rated the anime
    const existingRating = anime.ratings.find(rating => rating.user.equals(user._id));
    if (existingRating) {
        return res.status(400).send('User has already rated this anime');
    }

    // Add the new rating
    const newRating = {
        user: user._id,
        rating: req.body.rating,
    };

    anime.ratings.push(newRating);
    anime.numberOfRatings += 1;

    // Recalculate average rating
    const totalRating = anime.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    anime.averageRating = totalRating / anime.numberOfRatings;

    // Save the changes
    await anime.save();

    return res.status(200).json({
        averageRating: anime.averageRating,
        numberOfRatings: anime.numberOfRatings,
    });
});

export default router;
