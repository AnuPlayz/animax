import mongoose, { Schema, model, mongo } from "mongoose";

interface AnimeComment {
    user: mongoose.Types.ObjectId;
    comment: string;
}

interface AnimeRating {
    user: mongoose.Types.ObjectId;
    rating: number;
}

interface AnimeEpisode {
    number: string;
    title: string;
}

interface Anime {
    name: string;
    description: string;
    coverImage: string;
    characters: [string];
    createdBy: string;
    ratings: AnimeRating[];
    averageRating: number;
    numberOfRatings: number;
    comments: AnimeComment[];
    proposalStatus: 'queued' | 'accepted' | 'rejected';
    editor: string;
    episodes: AnimeEpisode[];
}

const animeSchema = new Schema<Anime>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    coverImage: { type: String, required: true },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 10, default: 0 },
      }],
    characters: [{ type: String, required: false }],
    createdBy: { type:String, required: false },
    averageRating: { type: Number, default: 0 },
    numberOfRatings: { type: Number, default: 0 },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: { type: String, required: true },
      }],
    proposalStatus: { type: String, enum: ['queued', 'accepted', 'rejected'], default: 'queued' },
    editor: { type: String },
    episodes: [{
        number: { type: String },
        title: { type: String },
    }],
});

const Anime = model<Anime>('Anime', animeSchema);

export default Anime;
