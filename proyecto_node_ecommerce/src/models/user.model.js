import mongoose from "mongoose";

const userCollection = "usuarios";

const userSchema = new mongoose.Schema({
    firt_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required:[true, "Debes colocar el email para avanzar"] 
    },
    password: String,
    age: Number
},
    {
        versionKey: false //Deshabilita el parametro "__v" 
    }
)

export const userModel = mongoose.model(userCollection,userSchema)