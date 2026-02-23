const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDb = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(`Error in connection: ${err}`)
    });
}

module.exports = connectDb;
