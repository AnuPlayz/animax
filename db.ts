import { Schema, model, connect } from "mongoose";
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

interface Anime {
  name: string;
  description: string;
  coverImage: string;
  characters: [string];
  createdBy: string;
}

interface User {
    name: string;
    password: string;
    token: string;
    bio: string;
}

const userSchema = new Schema<User>({
    name: { type: String, required: true},
    password: { type: String, required: true},
    token: { type: String },
    bio: { type: String }
});

const animeSchema = new Schema<Anime>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    characters: [{ type: String, required: true }],
    createdBy: { type:String, required: true }
});

const user = model<User>('User', userSchema);
const anime = model<Anime>('Anime', animeSchema);

run().catch(err => console.log(err));

async function run() {
  await connect('mongodb+srv://admin:ruokaYeUoTxymOWF@cluster0.jc2sebf.mongodb.net/');
  console.log('connected to db');
}

//landing page
app.get('/',(req:any,res:any) => {
    res.send('ur mom');
})

//sign up
app.post('/signup', jsonParser, (req:any, res:any) => {
    const userCreate = new user({
        name: req.body.name,
        password: req.body.password,
        bio: req.body.bio
    });
    userCreate.save();
    return res.status(200).json(userCreate);
})

//login
app.post('/login', jsonParser, async (req:any, res:any) => {
    const username = req.body.name;
    const userpass = await user.findOne({name: username});
    if(!userpass){
         res.status(404).send("not found user");
    }
    else if(userpass.password == req.body.password){
        let token = (Math.random() + 1).toString(36).substring(7);
        userpass.token = token;
        await userpass.save();
        res.status(200).send("logged in and updated user token");
    }
})

//send all the animes
app.get('/anime',async function (req:any,res:any){
    let animes = await anime.find({});
    res.status(200).send(animes);
})

//create an anime in database and save it
app.post('/create', jsonParser, async (req:any, res:any) => {
    const usertoken = req.headers.authorization;
    if(!usertoken){
        return res.status(401).send("not logined");
    }
    const userfind = await user.findOne({token: usertoken});
    if(!userfind){
        return res.status(401).send("not valid user token");
    }

    const animeCreate = new anime({
        name: req.body.name,
        description: req.body.description,
        coverImage: req.body.coverImage,
        characters: req.body.characters,
        createdBy: userfind.name
    });
    animeCreate.save();
    return res.status(200).json(animeCreate);
})

//find a specific anime
app.get('/animes/:id', async (req: any, res: any) => {
    const animeId = req.params.id;
    const foundAnime = await anime.findOne({name: animeId});

    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }
    return res.status(200).json(foundAnime);
});

//delete a anime
app.get('/anime/delete/:name', async (req: any, res: any) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }

    const userfind = await user.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }

    const animeId = req.params.name;
    const foundAnime = await anime.findOne({ name: animeId });

    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }

    if (foundAnime.createdBy !== userfind.name) {
        return res.status(403).send('You do not have permission to delete this anime');
    }

    await foundAnime.deleteOne();
    return res.status(200).send('Anime deleted successfully');
});

//update an anime
app.post('/anime/update/:name', jsonParser, async (req: any, res: any) => {
    const usertoken = req.headers.authorization;
    if (!usertoken) {
        return res.status(401).send("Not logged in");
    }

    const userfind = await user.findOne({ token: usertoken });
    if (!userfind) {
        return res.status(401).send("Not a valid user token");
    }

    const animeId = req.params.name;
    const foundAnime = await anime.findOne({ name: animeId });

    if (!foundAnime) {
        return res.status(404).send('Anime not found');
    }

    if (foundAnime.createdBy !== userfind.name) {
        return res.status(403).send('You do not have permission to update this anime');
    }

    foundAnime.name = req.body.name || foundAnime.name;
    foundAnime.description = req.body.description || foundAnime.description;
    foundAnime.coverImage = req.body.coverImage || foundAnime.coverImage;
    foundAnime.characters = req.body.characters || foundAnime.characters;

    await foundAnime.save();
    return res.status(200).json(foundAnime);
});


//running the server
app.listen(5555, () => {
    console.log('App running on http://localhost:5555/')
})