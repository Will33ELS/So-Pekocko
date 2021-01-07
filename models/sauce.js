const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User"},
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, min: 1, max: 10, required: true },
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0},
    usersLiked:[ { type: Schema.Types.ObjectId, ref: "User"} ],
    usersDisliked:[ { type: Schema.Types.ObjectId, ref: "User"} ],
});

module.exports = mongoose.model("Sauce", sauceSchema);
