const express = require('express');
import { connect } from "mongoose";
import * as fs from 'fs';
import * as path from 'path';
const checkUserRole = require('./middleware');

const app = express();

app.use('/admin', checkUserRole);

app.get('/admin/dashboard', (req:any, res:any) => {
    res.send('Admin Dashboard');
});

async function run() {
    await connect('mongodb+srv://admin:ruokaYeUoTxymOWF@cluster0.jc2sebf.mongodb.net/');
    console.log('Connected to the database');
}

run().catch(err => console.log(err));

const routesFolder = path.join(__dirname, 'routes');

//read all files in the routes folder
fs.readdirSync(routesFolder).forEach(file => {
  if (file.endsWith('.js')) {
    const routePath = `./routes/${file.replace('.js', '')}`;
    const router = require(routePath).default;
    app.use('/', router);
    console.log(`Imported and used route from: ${routePath}`);
  }
});

// Running the server
const port = 5555;
app.listen(port, () => {
    console.log(`App running on http://localhost:${port}/`);
});
