const settings = require("../settings.json");
const mongoose = require(settings.mongoose);

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    lb: String,
    money: Number,
    daily: Number,
});

module.exports = mongoose.model("Data", dataSchema);
