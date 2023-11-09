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
const Anime_1 = __importDefault(require("../models/Anime"));
const mongoose_1 = require("mongoose");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongoose_1.connect)('mongodb+srv://admin:ruokaYeUoTxymOWF@cluster0.jc2sebf.mongodb.net/');
        console.log('Connected to the database');
        const animeDocuments = yield Anime_1.default.find({});
        let startProcessing = false;
        for (const animeDocument of animeDocuments) {
            if (animeDocument.name === "Gintama: Kanketsu-hen - Yorozuya yo Eien Nare") {
                startProcessing = true;
            }
            if (!startProcessing) {
                continue;
            }
            const animeName = animeDocument.name;
            const searchApiUrl = `http://localhost:4000/anime/search?q=${encodeURIComponent(animeName)}&page=1`;
            const searchResponse = yield fetch(searchApiUrl);
            if (!searchResponse.ok) {
                throw new Error(`Search API request failed with status ${searchResponse.status}`);
            }
            const searchData = yield searchResponse.json();
            const firstAnimeId = searchData.animes[0].id;
            const episodeApiUrl = `http://localhost:4000/anime/episodes/${firstAnimeId}`;
            try {
                const episodeResponse = yield fetch(episodeApiUrl);
                if (!episodeResponse.ok) {
                    if (episodeResponse.status === 429) {
                        console.log(`Rate limit exceeded.`);
                        continue; // Retry the current anime
                    }
                    else {
                        throw new Error(`Episode API request failed with status ${episodeResponse.status}`);
                    }
                }
                const episodeData = yield episodeResponse.json();
                for (const episode of episodeData.episodes) {
                    const newEpisode = {
                        number: episode.number,
                        title: episode.title
                    };
                    animeDocument.episodes.push(newEpisode);
                    yield animeDocument.save();
                }
                console.log(animeDocument.episodes);
                yield new Promise(resolve => setTimeout(resolve, 10000));
            }
            catch (error) {
                console.log(`Error processing anime ${animeName}:`, error);
            }
        }
    });
}
run().catch(err => console.log(err));
