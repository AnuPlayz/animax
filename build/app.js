"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const routes_1 = __importDefault(require("./routes/routes"));
const mongoose_1 = require("mongoose");
async function run() {
    await (0, mongoose_1.connect)('mongodb+srv://admin:ruokaYeUoTxymOWF@cluster0.jc2sebf.mongodb.net/');
    console.log('connected to db');
}
run().catch(err => console.log(err));
const app = express();
app.use('/', routes_1.default);
//running the server
app.listen(5555, () => {
    console.log('App running on http://localhost:5555/');
});
