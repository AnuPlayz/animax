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
const Anime_1 = __importDefault(require("../models/Anime"));
router.get('/animes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const animeId = req.params.id;
    const foundAnime = yield Anime_1.default.findOne({ name: animeId });
    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    return res.status(200).json(foundAnime);
}));
exports.default = router;
