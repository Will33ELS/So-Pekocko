const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const env = require("dotenv");
const apiRoutes = require("./route/api");

const app = express();

//Chargement du fichier .env
env.config();

// Connexion à la base de données
mongoose.connect(process.env.MONGODB,
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

// Accès au dossier images
app.use('/upload', express.static(path.join(__dirname, 'upload')));

// Routes de l'API
app.use("/api", apiRoutes);


module.exports = app;
