import mongoose from "mongoose";

const mongoInit = async (mongoUrl: string) => {
    mongoose.connect(mongoUrl)
        .then(() => {
            console.log("MongoDB connected successfully!");
        })
        .catch(err => {
            console.log(`MongoDB connection error. ${err}`);
        });
};

export default mongoInit;