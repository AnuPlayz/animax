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
router.post('/login', jsonParser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.name;
    const userpass = yield User_1.default.findOne({ name: username });
    if (!userpass) {
        res.status(404).send("not found user");
    }
    else if (userpass.password == req.body.password) {
        let token = (Math.random() + 1).toString(36).substring(7);
        userpass.token = token;
        yield userpass.save();
        res.status(200).send("logged in and updated user token");
    }
}));
exports.default = router;
