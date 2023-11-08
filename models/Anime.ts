import { Schema, model } from "mongoose";

interface Anime {
    name: string;
    description: string;
    coverImage: string;
    characters: [string];
    createdBy: string;
}

const animeSchema = new Schema<Anime>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    characters: [{ type: String, required: true }],
    createdBy: { type:String, required: true }
});

const Anime = model<Anime>('Anime', animeSchema);

export default Anime;
