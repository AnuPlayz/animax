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
const Anime_1 = __importDefault(require("../models/Anime"));
router.post('/admin/decision/:name', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const anime = yield Anime_1.default.findOne({ name: req.params.name });
    if (!anime) {
        return res.status(404).send('Anime not found');
    }
    if (req.body.decision === 'accept') {
        anime.proposalStatus = 'accepted';
    }
    else if (req.body.decision === 'reject') {
        anime.proposalStatus = 'rejected';
    }
    if (anime.proposalStatus == 'accepted') {
        yield anime.save();
    }
    return res.status(200).json(anime.proposalStatus);
}));
exports.default = router;
