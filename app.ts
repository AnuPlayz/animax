const express = require('express');
import routes from './routes/routes';
import { connect } from "mongoose";

async function run() {
    await connect('mongodb+srv://admin:ruokaYeUoTxymOWF@cluster0.jc2sebf.mongodb.net/');
    console.log('connected to db');
}
run().catch(err => console.log(err));

const app = express();
app.use('/', routes);

//running the server
app.listen(5555, () => {
    console.log('App running on http://localhost:5555/')
})