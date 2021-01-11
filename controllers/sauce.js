const Sauce = require("../models/sauce");

//RECUPERATION DES SAUCES
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//RECUPERATION D'UNE SAUCE
exports.getSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

//CREATION D'UNE SAUCE
exports.createSauce = (req, res, next) => {
    const sauceObject = req.body.sauce;
    const sauce = new Sauce({
        userId: sauceObject.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //ROUTE DE L'IMAGE
        heat: sauceObject.heat,
        usersLiked: [],
        usersDisliked: []
    });
    Sauce.find().then(sauce => {
        Sauce.updateOne({ _id: sauce._id}, {
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: []
        });
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce crée avec succés !"}))
        .catch(error => res.status(400).json({ error }));
}

//MISE A JOUR D'UNE SAUCE
exports.updateSauce = (req, res, next) => {
    if(req.body.sauce){ //UN FICHIER EST FOURNIS
        const sauceObject = req.body.sauce;
        Sauce.updateOne({ _id: req.params.id}, {
            name: sauceObject.name,
            manufacturer: sauceObject.manufacturer,
            description: sauceObject.description,
            mainPepper: sauceObject.mainPepper,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`, //ROUTE DE L'IMAGE
            heat: sauceObject.heat,
        })
            .then(() => res.status(200).json({ message: "La sauce a été modifié avec succés !"}))
            .catch(error => res.status(404).json({ error }));
    }else{ //AUCUN FICHIER N'EST FOURNIS
        Sauce.updateOne({ _id: req.params.id}, {
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            heat: req.body.heat,
        })
            .then(() => res.status(200).json({ message: "La sauce a été modifié avec succés !"}))
            .catch(error => res.status(404).json({ error }));
    }
};

//SUPPRESSION D'UNE SAUCE
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimé avec succès !"}))
        .catch(error => res.status(404).json({ error }));
}

//AJOUT D'UNE REACTION (J'AIME, JE N'AIME PAS)
exports.likeSauce = (req, res, next) => {
    //RECUPERATION DE LA SAUCE
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            removeReaction(req.body.userId, sauce); //SUPPRESSION DES REACTIONS DE L'UTILISATEUR SUR LA SAUCE

            if(req.body.like === 0){ // L'UTILISATEUR SUPPRIME SON AVIS
                res.status(200).json({ message: "Votre réaction a été supprimé !"})
            }else if(req.body.like === 1){ // L'UTILISATEUR AIME LA SAUCE
                Sauce.updateOne({ _id: sauce._id }, {
                    usersLiked: sauce.usersLiked.push(userId),
                    likes: sauce.likes + 1
                })
                    .then(() => res.status(200).json({ message: "Vous aimez cette sauce !"}))
                    .catch(error => res.status(400).json({ error }));
            }else if(req.body.like === -1){ // L'UTILISATEUR N'AIME PAS LA SAUCE
                Sauce.updateOne({ _id: sauce._id }, {
                    usersDisliked: sauce.usersDisliked.push(userId),
                    dislikes: sauce.dislikes + 1
                })
                    .then(() => res.status(200).json({ message: "Vous aimez cette sauce !"}))
                    .catch(error => res.status(400).json({ error }));
            }else{
                res.status(400).json({ error: "Votre réaction est inconnu !"})
            }
        })
        .catch(error => res.status(404).json({ error }));
};

//SUPPRESSION DES REACTIONS D'UN UTILISATEUR SUR UNE SAUCE
const removeReaction = (userid, sauce) =>{
    const usersLiked = sauce.usersLiked;
    const usersDisliked = sauce.usersDisliked;
    if(usersLiked.includes(userid)){
        usersLiked.remove(userid);
        Sauce.updateOne({ _id: sauce._id }, {
            usersLiked: usersLiked,
            likes: sauce.likes - 1
        });
    }
    if(usersDisliked.includes(userid)){
        usersDisliked.remove(userid);
        Sauce.updateOne({ _id: sauce._id }, {
            usersDisliked: usersDisliked,
            dislikes: sauce.dislikes - 1
        });
    }
}