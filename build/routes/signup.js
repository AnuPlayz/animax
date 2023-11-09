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
router.post('/signup', jsonParser, (req, res) => {
    const userCreate = new User_1.default({
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio
    });
    userCreate.save();
    return res.status(200).json(userCreate);
});
exports.default = router;
