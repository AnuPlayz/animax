import Anime from '../models/Anime';
import { connect } from "mongoose";

async function run() {
    await connect('mongodb+srv://admin:ruokaYeUoTxymOWF@cluster0.jc2sebf.mongodb.net/');
    console.log('Connected to the database');

    const animeDocuments = await Anime.find({});
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
        const searchResponse = await fetch(searchApiUrl);

        if (!searchResponse.ok) {
            throw new Error(`Search API request failed with status ${searchResponse.status}`);
        }

        const searchData: any = await searchResponse.json();

        const firstAnimeId = searchData.animes[0].id;
        const episodeApiUrl = `http://localhost:4000/anime/episodes/${firstAnimeId}`;
        
        try {
        const episodeResponse = await fetch(episodeApiUrl);

        if (!episodeResponse.ok) {
            if (episodeResponse.status === 429) {
                console.log(`Rate limit exceeded.`);
                continue; // Retry the current anime
            } else {
                throw new Error(`Episode API request failed with status ${episodeResponse.status}`);
            }
        }

        const episodeData: any = await episodeResponse.json();

        for (const episode of episodeData.episodes) {
            const newEpisode = {
                number: episode.number,
                title: episode.title
            };

            animeDocument.episodes.push(newEpisode);
            await animeDocument.save();
        }
        console.log(animeDocument.episodes);
        await new Promise(resolve => setTimeout(resolve, 10000));

        } catch(error){
            console.log(`Error processing anime ${animeName}:`, error);
        }
    }
}

run().catch(err => console.log(err));
