const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRoutes = require("./route/api");

const app = express();

// Connexion à la base de données
mongoose.connect('mongodb+srv://editor:QNo8dtduS7dC2pAp@cluster0.v4rxq.mongodb.net/so_pekocko?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// BODY-PARSER
app.use(bodyParser.json());

// Routes de l'API
app.use("/api", apiRoutes);


module.exports = app;
