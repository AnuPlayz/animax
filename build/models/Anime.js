"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const animeSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    characters: [{ type: String, required: true }],
    createdBy: { type: String, required: true }
});
const Anime = (0, mongoose_1.model)('Anime', animeSchema);
exports.default = Anime;
