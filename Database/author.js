const mongoose = require("mongoose");

//creating author schema
const AuthorSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        books: [String]
    },
    {
        id: Number,
        name: String,
        books: [String]
    }
);

const AuthorModel = mongoose.model("author", AuthorSchema);

module.exports = AuthorModel;