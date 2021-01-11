const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const crypto = require("crypto-js");

const User = require("../models/user");

const utils = require("../utils/utils");

//CREATION DU L'UTILISATEUR
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //HASHAGE DU MOT DE PASSE AVEC BCRYPT
        .then(hash => {
            const hashEmail = crypto.SHA256(req.body.email);
            const user = new User({
                email: hashEmail.toString(crypto.enc.Base64),
                password: hash
            });
            user.save().then(() => res.status(201).json( { message: "Utilisateur crée !"} ))
                .catch(error => {
                    res.status(400).json( { error })
                });
        })
        .catch(error => res.status(500).json({ error }));
}

//CONNEXION DE L'UTILISATEUR
exports.signin = (req, res, next) => {
    const hashEmail = crypto.SHA256(req.body.email);
    User.findOne({ email: hashEmail.toString(crypto.enc.Base64) }).then(user => {
        if(!user){
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
        //COMPARAISON DU MOT DE PASSE ENVOYER PAR L'UTILISATEUR ET CELUI PRESENT EN BASE DE DONNEE
        bcrypt.compare(req.body.password, user.password).then(valid => {
            if(!valid){
                return res.status(401).json({ error: "Mot de passe incorrect !"});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    utils.getTokenJWT(), //RECUPERATION DE LA CLE DANS LE FICHIER UTILS.JS
                    {expiresIn: "24h"} //LA CLE N'EST VALIDE QUE 24h
                )
            });
        }).catch(error => res.status(500).json({ error }));
    })
        .catch(error => console.log(error));
}
