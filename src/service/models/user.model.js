import mongoose from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    age: Number,
    cartId: {type: mongoose.Schema.Types.ObjectId, ref: "carritos"}
},    
    {
        versionKey: false //Deshabilita el parametro "__v" 
    }
);

export const userModel = mongoose.model(userCollection,userSchema)