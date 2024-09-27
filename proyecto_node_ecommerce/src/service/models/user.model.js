import mongoose from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    age: Number
},
    {
        versionKey: false //Deshabilita el parametro "__v" 
    }
);

export const userModel = mongoose.model(userCollection,userSchema)