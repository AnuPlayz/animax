"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const Anime_1 = __importDefault(require("../models/Anime"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
const jsonParser = body_parser_1.default.json();
router.post('/:name/rate', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send('Not logged in');
    }
    const user = yield User_1.default.findOne({ token: usertoken });
    if (!user) {
        return res.status(401).send('Not a valid user token');
    }
    const anime = yield Anime_1.default.findOne({ name: req.params.name });
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
    yield anime.save();
    return res.status(200).json({
        averageRating: anime.averageRating,
        numberOfRatings: anime.numberOfRatings,
    });
}));
exports.default = router;
