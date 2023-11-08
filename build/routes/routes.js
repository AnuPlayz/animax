"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const User_1 = __importDefault(require("../models/User"));
const Anime_1 = __importDefault(require("../models/Anime"));
//landing page
router.get('/', (req, res) => {
    res.send('ur mom');
});
//sign up
router.post('/signup', jsonParser, (req, res) => {
    const userCreate = new User_1.default({
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio
    });
    userCreate.save();
    return res.status(200).json(userCreate);
});
//login
router.post('/login', jsonParser, async (req, res) => {
    const username = req.body.name;
    const userpass = await User_1.default.findOne({ name: username });
    if (!userpass) {
        res.status(404).send("not found user");
    }
    else if (userpass.password == req.body.password) {
        let token = (Math.random() + 1).toString(36).substring(7);
        userpass.token = token;
        await userpass.save();
        res.status(200).send("logged in and updated user token");
    }
});
//send all the animes
router.get('/anime', async function (req, res) {
    let animes = await Anime_1.default.find({});
    res.status(200).send(animes);
});
//create an anime in database and save it
router.post('/create', jsonParser, async (req, res) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("not logined");
    }
    const userfind = await User_1.default.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("not valid user token");
    }
    const animeCreate = new Anime_1.default({
        name: req.body.name,
        description: req.body.description,
        coverImage: req.body.coverImage,
        characters: req.body.characters,
        createdBy: userfind.name
    });
    animeCreate.save();
    return res.status(200).json(animeCreate);
});
//find a specific anime
router.get('/animes/:id', async (req, res) => {
    const animeId = req.params.id;
    const foundAnime = await Anime_1.default.findOne({ name: animeId });
    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    return res.status(200).json(foundAnime);
});
//delete a anime
router.get('/anime/delete/:name', async (req, res) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }
    const userfind = await User_1.default.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }
    const animeId = req.params.name;
    const foundAnime = await Anime_1.default.findOne({ name: animeId });
    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    if (foundAnime.createdBy !== userfind.name) {
        return res.status(403).send('You do not have permission to delete this anime');
    }
    await foundAnime.deleteOne();
    return res.status(200).send('Anime deleted successfully');
});
//update an anime
router.post('/anime/update/:name', jsonParser, async (req, res) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }
    const userfind = await User_1.default.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }
    const animeId = req.params.name;
    const foundAnime = await Anime_1.default.findOne({ name: animeId });
    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    if (foundAnime.createdBy !== userfind.name) {
        return res.status(403).send('You do not have permission to update this anime');
    }
    foundAnime.name = req.body.name || foundAnime.name;
    foundAnime.description = req.body.description || foundAnime.description;
    foundAnime.coverImage = req.body.coverImage || foundAnime.coverImage;
    foundAnime.characters = req.body.characters || foundAnime.characters;
    await foundAnime.save();
    return res.status(200).json(foundAnime);
});
exports.default = router;