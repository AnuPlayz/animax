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
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
const User_1 = __importDefault(require("../models/User"));
const Anime_1 = __importDefault(require("../models/Anime"));
router.post('/anime/update/:name', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }
    const userfind = yield User_1.default.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }
    const animeId = req.params.name;
    const foundAnime = yield Anime_1.default.findOne({ name: animeId });
    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    foundAnime.name = req.body.name || foundAnime.name;
    foundAnime.description = req.body.description || foundAnime.description;
    foundAnime.coverImage = req.body.coverImage || foundAnime.coverImage;
    foundAnime.characters = req.body.characters || foundAnime.characters;
    foundAnime.editor = userfind.name;
    yield foundAnime.save();
    return res.status(200).json(foundAnime);
}));
exports.default = router;
